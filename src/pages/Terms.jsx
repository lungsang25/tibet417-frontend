import React from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import Title from '../components/Title'
import SEO from '../components/SEO'

const Clause = ({ number, heading, children }) => (
  <div className='flex flex-col gap-3'>
    <b className='text-gray-800'>{number}. {heading}</b>
    {children}
  </div>
)

const Terms = () => {
  const { t } = useTranslation('terms')
  const clauses = t('clauses', { returnObjects: true })

  return (
    <div>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        path='/terms'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Terms & Conditions' }]}
      />

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={t('heading.text1')} text2={t('heading.text2')} as='h1' />
      </div>

      <div className='my-10 flex flex-col gap-8 text-sm text-gray-600 max-w-4xl'>

        <div className='border-l-2 border-gray-300 pl-4 flex flex-col gap-2'>
          <p>{t('version')}</p>
          <p>{t('translationNotice')}</p>
        </div>

        {clauses.map((clause) => (
          <Clause key={clause.number} number={clause.number} heading={clause.heading}>
            {clause.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            {clause.list && (
              <ul className='list-disc pl-5 flex flex-col gap-2'>
                {clause.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
            {clause.number === '13' && (
              <p>{t('contactPrefix')}<Link to='/contact' className='underline'>{t('contactLink')}</Link>{t('contactSuffix')}</p>
            )}
          </Clause>
        ))}

      </div>
    </div>
  )
}

export default Terms
