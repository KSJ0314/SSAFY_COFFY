import { useState, useEffect, useRef } from 'react'
import PageLayout from '../components/PageLayout'
import InquiryModal from '../components/InquiryModal'
import {
  subscribeInquiries, saveInquiry, updateInquiry, deleteInquiry,
  subscribeComments, saveComment, deleteComment,
  type Inquiry, type Comment,
} from '../services/inquiryService'

const PAGE_SIZE = 10

function formatDate(ts: any): string {
  if (!ts?.toDate) return ''
  const d: Date = ts.toDate()
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
}

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({})
  const commentUnsubsRef = useRef<Map<string, () => void>>(new Map())
  const [commentInputs, setCommentInputs] = useState<Record<string, { content: string; password: string }>>({})
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Inquiry | null>(null)

  useEffect(() => {
    const unsub = subscribeInquiries(data => {
      setInquiries(data)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsubs = commentUnsubsRef.current
    return () => { unsubs.forEach(fn => fn()) }
  }, [])

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE))

  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(totalPages - 1)
  }, [page, totalPages])

  const pageItems = inquiries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  useEffect(() => {
    if (expandedId && !pageItems.find(i => i.id === expandedId)) {
      commentUnsubsRef.current.get(expandedId)?.()
      commentUnsubsRef.current.delete(expandedId)
      setCommentsMap(cm => { const { [expandedId]: _, ...rest } = cm; return rest })
      setExpandedId(null)
    }
  }, [page])

  function toggleExpand(id: string) {
    setExpandedId(prev => {
      if (prev === id) {
        commentUnsubsRef.current.get(id)?.()
        commentUnsubsRef.current.delete(id)
        setCommentsMap(cm => { const { [id]: _, ...rest } = cm; return rest })
        return null
      }
      if (prev !== null) {
        commentUnsubsRef.current.get(prev)?.()
        commentUnsubsRef.current.delete(prev)
        setCommentsMap(cm => { const { [prev]: _, ...rest } = cm; return rest })
      }
      const unsub = subscribeComments(id, comments => {
        setCommentsMap(cm => ({ ...cm, [id]: comments }))
      })
      commentUnsubsRef.current.set(id, unsub)
      return id
    })
  }

  function getCommentInput(id: string) {
    return commentInputs[id] ?? { content: '', password: '' }
  }

  function setCommentField(id: string, field: 'content' | 'password', value: string) {
    setCommentInputs(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? { content: '', password: '' }), [field]: value },
    }))
  }

  function handleOpenCreate() {
    setEditTarget(null)
    setShowModal(true)
  }

  function handleOpenEdit(inquiry: Inquiry) {
    setEditTarget(inquiry)
    setShowModal(true)
  }

  async function handleModalSubmit(data: { title: string; content: string; password: string; name: string; class: string }) {
    if (editTarget) {
      if (data.password !== editTarget.password) {
        window.alert('비밀번호가 일치하지 않습니다.')
        return
      }
      await updateInquiry(editTarget.id!, { title: data.title, content: data.content })
    } else {
      await saveInquiry({
        title: data.title,
        content: data.content,
        password: data.password,
        name: data.name || null,
        class: data.class || null,
      })
    }
    setShowModal(false)
  }

  async function handleDelete(inquiry: Inquiry) {
    if (!inquiry.id) return
    const input = window.prompt(`문의를 삭제하려면 비밀번호를 입력하세요.`)
    if (input === null) return
    if (input !== inquiry.password) {
      window.alert('비밀번호가 일치하지 않습니다.')
      return
    }
    if (expandedId === inquiry.id) {
      commentUnsubsRef.current.get(inquiry.id)?.()
      commentUnsubsRef.current.delete(inquiry.id)
      setExpandedId(null)
    }
    await deleteInquiry(inquiry.id)
  }

  async function handleAddComment(inquiryId: string) {
    const input = getCommentInput(inquiryId)
    if (!input.content.trim() || !input.password) return
    const commentData: { content: string; password: string; isAdmin?: boolean } = {
      content: input.content.trim(),
      password: input.password,
    }
    if (import.meta.env.DEV) commentData.isAdmin = true
    await saveComment(inquiryId, commentData)
    setCommentInputs(prev => ({ ...prev, [inquiryId]: { content: '', password: '' } }))
  }

  async function handleDeleteComment(inquiryId: string, comment: Comment) {
    if (!comment.id) return
    const input = window.prompt('댓글을 삭제하려면 비밀번호를 입력하세요.')
    if (input === null) return
    if (input !== comment.password) {
      window.alert('비밀번호가 일치하지 않습니다.')
      return
    }
    await deleteComment(inquiryId, comment.id)
  }

  const actions = (
    <>
      <div className="list-meta">총 {inquiries.length}건</div>
      <button className="inquiry-write-btn" onClick={handleOpenCreate}>+ 문의 작성</button>
    </>
  )

  return (
    <PageLayout title="문의 게시판" backPath="/" actions={actions} tableMinHeight={540}>
      {loading ? (
        <div className="empty loading-text">불러오는 중...</div>
      ) : (
        <table className="inquiry-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>제목</th>
              <th style={{ width: '70px' }}>작성자</th>
              <th style={{ width: '60px' }}>날짜</th>
              <th style={{ width: '56px' }}></th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty-cell">아직 문의가 없습니다.</td>
              </tr>
            )}
            {pageItems.map((inquiry, i) => {
              const id = inquiry.id!
              const expanded = expandedId === id
              const globalIndex = page * PAGE_SIZE + i + 1
              const comments = commentsMap[id] ?? []
              const input = getCommentInput(id)

              return [
                <tr
                  key={`row-${id}`}
                  className="inquiry-header-row inquiry-clickable"
                  onClick={() => toggleExpand(id)}
                >
                  <td>{globalIndex}</td>
                  <td className="inquiry-title-cell">
                    <span className="group-toggle">{expanded ? '▼' : '▶'}</span>
                    {inquiry.title}
                  </td>
                  <td>{inquiry.name ?? '익명'}</td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td className="inquiry-actions-cell">
                    <button
                      className="inquiry-edit-btn"
                      title="수정"
                      onClick={e => { e.stopPropagation(); handleOpenEdit(inquiry) }}
                    >✎</button>
                    <button
                      className="delete-order-btn"
                      title="삭제"
                      onClick={e => { e.stopPropagation(); handleDelete(inquiry) }}
                    >✕</button>
                  </td>
                </tr>,
                expanded && (
                  <tr key={`content-${id}`} className="inquiry-content-row">
                    <td colSpan={5}>
                      <div className="inquiry-content">
                        <p className="inquiry-content-text">{inquiry.content}</p>
                        <div className="inquiry-comments">
                          <div className="inquiry-comments-title">댓글 {comments.length > 0 ? `(${comments.length})` : ''}</div>
                          {comments.length === 0 && (
                            <div className="inquiry-no-comments">아직 댓글이 없습니다.</div>
                          )}
                          {comments.map(comment => (
                            <div key={comment.id} className={`comment-item${comment.isAdmin ? ' comment-item-admin' : ''}`}>
                              {comment.isAdmin && <span className="comment-admin-badge">관리자</span>}
                              <span className="comment-content">{comment.content}</span>
                              <span className="comment-date">{formatDate(comment.createdAt)}</span>
                              <button
                                className="comment-delete-btn"
                                onClick={() => handleDeleteComment(id, comment)}
                              >✕</button>
                            </div>
                          ))}
                          <div className="comment-input-row">
                            <input
                              className="comment-content-input"
                              placeholder="댓글 내용"
                              value={input.content}
                              onChange={e => setCommentField(id, 'content', e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleAddComment(id) }}
                            />
                            <input
                              type="password"
                              className="comment-password-input"
                              placeholder="비밀번호"
                              maxLength={4}
                              value={input.password}
                              onChange={e => setCommentField(id, 'password', e.target.value)}
                            />
                            <button
                              className="comment-submit-btn"
                              onClick={() => handleAddComment(id)}
                              disabled={!input.content.trim() || !input.password}
                            >작성</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ),
              ]
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <div className="inquiry-pagination">
                  <button
                    className="kiosk-pagination-btn"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 0}
                  >‹</button>
                  <span className="inquiry-page-info">{page + 1} / {totalPages}</span>
                  <button
                    className="kiosk-pagination-btn"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages - 1}
                  >›</button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
      {showModal && (
        <InquiryModal
          mode={editTarget ? 'edit' : 'create'}
          initial={editTarget ? { title: editTarget.title, content: editTarget.content } : undefined}
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </PageLayout>
  )
}
