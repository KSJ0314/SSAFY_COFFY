import { useState, useEffect, useRef } from 'react'
import PageLayout from '../../components/PageLayout'
import InquiryModal from '../../components/InquiryModal'
import { StyledTable, DeleteOrderBtn, KioskPaginationBtn } from '../../styles/shared'
import {
  WriteBtn, MetaText, EmptyBox, InquiryHeaderRow, GroupToggle,
  IndexCell, ActionsCell, ActionsInner, EditBtn,
  ContentRow, ContentExpand, ContentText,
  Comments, CommentsTitle, NoComments,
  CommentItem, AdminBadge, CommentContent, CommentDate, CommentDeleteBtn,
  CommentInputRow, CommentContentInput, CommentPasswordInput, CommentSubmitBtn,
  Pagination, PageInfo,
} from './InquiryPage.styled'
import {
  subscribeInquiries, saveInquiry, updateInquiry, deleteInquiry,
  subscribeComments, saveComment, deleteComment, fetchComments,
  type Inquiry, type Comment,
} from '../../services/inquiryService'

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
        localStorageName: localStorage.getItem('coffy_name') || null,
      })
    }
    setShowModal(false)
  }

  async function handleDelete(inquiry: Inquiry) {
    if (!inquiry.id) return
    if (import.meta.env.DEV) {
      if (!window.confirm('[관리자 모드] 게시글을 삭제하시겠습니까?')) return
    } else {
      const comments = commentsMap[inquiry.id] ?? await fetchComments(inquiry.id)
      if (comments.some(c => c.isAdmin)) {
        window.alert('관리자 답변이 달린 게시글은 삭제할 수 없습니다.')
        return
      }
    }
    if (!import.meta.env.DEV) {
      const input = window.prompt(`게시글을 삭제하려면 비밀번호를 입력하세요.`)
      if (input === null) return
      if (input !== inquiry.password) {
        window.alert('비밀번호가 일치하지 않습니다.')
        return
      }
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
    if (!input.content.trim()) return
    if (!import.meta.env.DEV && !input.password) return
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
    if (comment.isAdmin) {
      if (!import.meta.env.DEV) return
      if (!window.confirm('관리자 댓글을 삭제하시겠습니까?')) return
    } else {
      const input = window.prompt('댓글을 삭제하려면 비밀번호를 입력하세요.')
      if (input === null) return
      if (input !== comment.password) {
        window.alert('비밀번호가 일치하지 않습니다.')
        return
      }
    }
    await deleteComment(inquiryId, comment.id)
  }

  const actions = (
    <>
      <MetaText>총 {inquiries.length}건</MetaText>
      <WriteBtn onClick={handleOpenCreate}>+ 글 작성</WriteBtn>
    </>
  )

  return (
    <PageLayout title="자유 게시판" subTitle="자유롭게 게시글을 작성하세요!!" backPath="/" actions={actions} tableMinHeight={540}>
      {loading ? (
        <EmptyBox className="loading-text">불러오는 중...</EmptyBox>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>제목</th>
              <th style={{ width: '150px' }}>작성자</th>
              <th style={{ width: '60px' }}>날짜</th>
              <th style={{ width: '56px' }}></th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'inherit' }}>아직 게시글이 없습니다.</td>
              </tr>
            )}
            {pageItems.map((inquiry, i) => {
              const id = inquiry.id!
              const expanded = expandedId === id
              const globalIndex = page * PAGE_SIZE + i + 1
              const comments = commentsMap[id] ?? []
              const input = getCommentInput(id)

              return [
                <InquiryHeaderRow
                  key={`row-${id}`}
                  onClick={() => toggleExpand(id)}
                >
                  <IndexCell>
                    <GroupToggle>{expanded ? '▼' : '▶'}</GroupToggle>
                    &ensp;{globalIndex}
                  </IndexCell>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.name ?? '익명'}</td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <ActionsCell>
                    <ActionsInner>
                      <EditBtn
                        title="수정"
                        onClick={e => { e.stopPropagation(); handleOpenEdit(inquiry) }}
                      >✎</EditBtn>
                      <DeleteOrderBtn
                        title="삭제"
                        onClick={e => { e.stopPropagation(); handleDelete(inquiry) }}
                      >✕</DeleteOrderBtn>
                    </ActionsInner>
                  </ActionsCell>
                </InquiryHeaderRow>,
                expanded && (
                  <ContentRow key={`content-${id}`}>
                    <td colSpan={5}>
                      <ContentExpand>
                        <ContentText>{inquiry.content}</ContentText>
                        <Comments>
                          <CommentsTitle>댓글 {comments.length > 0 ? `(${comments.length})` : ''}</CommentsTitle>
                          {comments.length === 0 && (
                            <NoComments>아직 댓글이 없습니다.</NoComments>
                          )}
                          {comments.map(comment => (
                            <CommentItem key={comment.id} $admin={comment.isAdmin}>
                              {comment.isAdmin && <AdminBadge>관리자</AdminBadge>}
                              <CommentContent>{comment.content}</CommentContent>
                              <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                              {(!comment.isAdmin || import.meta.env.DEV) && (
                                <CommentDeleteBtn
                                  onClick={() => handleDeleteComment(id, comment)}
                                >✕</CommentDeleteBtn>
                              )}
                            </CommentItem>
                          ))}
                          <CommentInputRow>
                            <CommentContentInput
                              placeholder="댓글 내용"
                              value={input.content}
                              onChange={e => setCommentField(id, 'content', e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleAddComment(id) }}
                            />
                            {!import.meta.env.DEV && (
                              <CommentPasswordInput
                                type="password"
                                placeholder="비밀번호"
                                maxLength={4}
                                value={input.password}
                                onChange={e => setCommentField(id, 'password', e.target.value)}
                              />
                            )}
                            <CommentSubmitBtn
                              onClick={() => handleAddComment(id)}
                              disabled={!input.content.trim() || (!import.meta.env.DEV && !input.password)}
                            >작성</CommentSubmitBtn>
                          </CommentInputRow>
                        </Comments>
                      </ContentExpand>
                    </td>
                  </ContentRow>
                ),
              ]
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <Pagination>
                  <KioskPaginationBtn
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 0}
                  >‹</KioskPaginationBtn>
                  <PageInfo>{page + 1} / {totalPages}</PageInfo>
                  <KioskPaginationBtn
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages - 1}
                  >›</KioskPaginationBtn>
                </Pagination>
              </td>
            </tr>
          </tfoot>
        </StyledTable>
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
