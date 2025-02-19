import { useContext, useRef } from 'react'
import { ShowLanguageModal } from '../../pages/_app'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import languages from '../../data/languages.json'
import styles from '../../styles/Personalize.module.css'
import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'

/**
 * A modal component that allows users to personalize their experience by changing the language
 * @returns {JSX.Element} The LanguageModal component
 * @constructor
 */
export default function LanguageModal () {
  const [showLanguageModal, setShowLanguageModal] = useContext(ShowLanguageModal)
  const languageModalBody = useRef()
  const router = useRouter()

  const { t, i18n } = useTranslation('personal')

  /**
   * Changes the current language.
   * @param {string} languageKey Language key
   */
  function changeLanguage (languageKey) {
    setShowLanguageModal(false)
    i18n.changeLanguage(languageKey)
    router.replace('/', '', { locale: i18n.language })
    document.cookie = `NEXT_LOCALE=${i18n.language}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5).toUTCString()}`
  }

  return (
    <Modal show={!!showLanguageModal} dialogClassName={styles.themeModal}
           onHide={() => setShowLanguageModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t('personal.modals.language.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={languageModalBody}>
        <Form>
          {languages.map((language, i) => (
            <Button
              key={i}
              id={`language-${i}`}
              className={styles.themeButton}
              variant={i18n.language === language.key ? 'primary' : 'secondary'}
              onClick={() => changeLanguage(language.key)}
            >
              {language.name[i18n.languages[0]]}
            </Button>
          ))}
        </Form>
      </Modal.Body>
    </Modal>
  )
}
