import { useState } from 'react'
import styled from 'styled-components'
import patchNotes from '../../data/patchNotes.json'
import electronPatchNotes from '../../data/electronPatchNotes.json'
import { ModalBackdrop, Modal, ModalBody, ModalHeader, ModalTitleRow } from '../../styles/shared'
import { CategoryTab } from '../../styles/shared'
import type { Props } from './types'

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
`

const PatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PatchItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PatchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const PatchVersion = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`

const PatchDate = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
`

const PatchChanges = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 4px;

  li {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text};
    padding-left: 14px;
    position: relative;
    line-height: 1.5;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`

export default function PatchNotesModal({ onClose }: Props) {
  const [tab, setTab] = useState<'web' | 'desktop'>('web')
  const notes = tab === 'web' ? patchNotes : electronPatchNotes

  return (
    <ModalBackdrop onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalBody>
          <ModalHeader>
            <ModalTitleRow>
              <h2>패치 노트</h2>
              <GithubLink
                href="https://github.com/KSJ0314/SSAFY_COFFY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </GithubLink>
            </ModalTitleRow>
          </ModalHeader>
          <Tabs>
            <CategoryTab $selected={tab === 'web'} onClick={() => setTab('web')}>Web</CategoryTab>
            <CategoryTab $selected={tab === 'desktop'} onClick={() => setTab('desktop')}>Desktop</CategoryTab>
          </Tabs>
          <PatchList>
            {notes.map(patch => (
              <PatchItem key={patch.version}>
                <PatchHeader>
                  <PatchVersion>v{patch.version}</PatchVersion>
                  <PatchDate>{patch.date}</PatchDate>
                </PatchHeader>
                <PatchChanges>
                  {patch.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </PatchChanges>
              </PatchItem>
            ))}
          </PatchList>
        </ModalBody>
      </Modal>
    </ModalBackdrop>
  )
}
