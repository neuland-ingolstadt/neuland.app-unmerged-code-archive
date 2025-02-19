import React, { useEffect, useMemo, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import ReactPlaceholder from 'react-placeholder'

import {
  faBus,
  faCar,
  faChargingStation,
  faTrain
} from '@fortawesome/free-solid-svg-icons'

import {
  RenderMobilityEntry,
  getMobilityEntries,
  getMobilityLabel,
  getMobilitySettings
} from '../../lib/backend-utils/mobility-utils'
import BaseCard from './BaseCard'
import { useTime } from '../../lib/hooks/time-hook'

import styles from '../../styles/Home.module.css'
import { useTranslation } from 'next-i18next'

const MAX_STATION_LENGTH = 20
const MOBILITY_ICONS = {
  bus: faBus,
  train: faTrain,
  parking: faCar,
  charging: faChargingStation
}

/**
 * Dashboard card for the mobility page.
 */
export default function MobilityCard () {
  const time = useTime()
  const [mobility, setMobility] = useState(null)
  const [mobilityError, setMobilityError] = useState(null)
  const [mobilitySettings, setMobilitySettings] = useState(null)
  const { t } = useTranslation(['dashboard', 'mobility'])

  const mobilityIcon = useMemo(() => {
    return mobilitySettings ? MOBILITY_ICONS[mobilitySettings.kind] : faBus
  }, [mobilitySettings])
  const mobilityLabel = useMemo(() => {
    return mobilitySettings ? getMobilityLabel(mobilitySettings.kind, mobilitySettings.station, t) : t('transport.title.unknown')
  }, [mobilitySettings, t])

  useEffect(() => {
    setMobilitySettings(getMobilitySettings())
  }, [])

  useEffect(() => {
    async function load () {
      if (!mobilitySettings) {
        return
      }

      try {
        setMobility(await getMobilityEntries(mobilitySettings.kind, mobilitySettings.station))
      } catch (e) {
        console.error(e)
        setMobilityError(t('transport.error.retrieval'))
      }
    }
    load()
  }, [mobilitySettings, time, t])

  return (
    <BaseCard
      icon={mobilityIcon}
      title={t(mobilityLabel)}
      link="/mobility"
    >
      <ReactPlaceholder type="text" rows={5} ready={mobility || mobilityError}>
        <ListGroup variant="flush">
          {mobility && mobility.slice(0, 4).map((entry, i) => <ListGroup.Item key={i} className={styles.mobilityItem}>
            <RenderMobilityEntry kind={mobilitySettings.kind} item={entry} maxLen={MAX_STATION_LENGTH} styles={styles} detailed={false}/>
          </ListGroup.Item>
          )}
          {mobility && mobility.length === 0 &&
            <ListGroup.Item>
              {t('transport.error.empty')}
            </ListGroup.Item>}
          {mobilityError &&
            <ListGroup.Item>
              {t('transport.error.generic')}
            </ListGroup.Item>}
        </ListGroup>
      </ReactPlaceholder>
    </BaseCard>
  )
}
