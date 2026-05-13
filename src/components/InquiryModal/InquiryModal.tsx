import { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  ModalBackdrop, Modal, ModalBody, ModalHeader, ModalClose, PrimaryBtn,
} from '../../styles/shared'
import { InquiryCancelBtn } from './InquiryModal.styled'
import type { Props } from './types'

const InquiryModal_ = styled(Modal)`
  width: 560px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
`

const FormRow = styled.div<{ $inline?: boolean }>`
  display: ${({ $inline }) => ($inline ? 'flex' : 'flex')};
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  align-items: ${({ $inline }) => ($inline ? 'flex-end' : 'initial')};
  gap: ${({ $inline }) => ($inline ? '12px' : '6px')};
`

const InlineItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.label};
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &.password {
    width: 100px;
  }
`

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  outline: none;
  font-family: inherit;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`

export default function InquiryModal({ mode, initial, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState(localStorage.getItem('coffy_name') ?? '')
  const [cls, setCls] = useState(localStorage.getItem('coffy_class') ?? '')
  const mouseDownOnBackdrop = useRef(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !password) return
    onSubmit({ title: title.trim(), content: content.trim(), password, name: name.trim(), class: cls.trim() })
  }

  return (
    <ModalBackdrop
      onMouseDown={() => { mouseDownOnBackdrop.current = true }}
      onMouseUp={() => { if (mouseDownOnBackdrop.current) onClose(); mouseDownOnBackdrop.current = false }}
    >
      <InquiryModal_ onMouseDown={e => { e.stopPropagation(); mouseDownOnBackdrop.current = false }}>
        <ModalBody>
          <ModalHeader>
            <h2>{mode === 'create' ? '게시글 작성' : '게시글 수정'}</h2>
            <ModalClose onClick={onClose}>✕</ModalClose>
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            {mode === 'create' && (
              <FormRow $inline>
                <InlineItem>
                  <Label>이름</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="이름" />
                </InlineItem>
                <InlineItem>
                  <Label>반</Label>
                  <Input value={cls} onChange={e => setCls(e.target.value)} placeholder="반" />
                </InlineItem>
              </FormRow>
            )}
            <FormRow>
              <Label>제목</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                autoFocus
              />
            </FormRow>
            <FormRow>
              <Label>내용</Label>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={5}
              />
            </FormRow>
            <FormRow>
              <Label>비밀번호</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className="password"
              />
            </FormRow>
            <FormActions>
              <InquiryCancelBtn type="button" onClick={onClose}>취소</InquiryCancelBtn>
              <PrimaryBtn
                type="submit"
                disabled={!title.trim() || !content.trim() || !password}
              >
                {mode === 'create' ? '작성' : '수정'}
              </PrimaryBtn>
            </FormActions>
          </Form>
        </ModalBody>
      </InquiryModal_>
    </ModalBackdrop>
  )
}
