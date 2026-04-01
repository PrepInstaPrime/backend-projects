import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { serverUrl } from '../../../config.mjs'
import styles from './Reports.module.css'
export default function Reports() {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  useEffect(() => {
    const getReports = async () => {
      const response = await axios.get(`${serverUrl}/getreports`)
      setReports(response.data.reports)
    }
    getReports()
  }, [])
  return (
    <div className={styles.reports}>
        <div className={styles.reportHeader}>
            {/* this will list all the report one one by one whensomeone will click at right panel that report will open */}
            {reports.map((report) => (
                <div className={styles.reportHeaderItem} key={report._id} onClick={() => setSelectedReport(report)}>
                    <h2>{report.propertyType}</h2>
                    <h2>{report.address}</h2>
                    <h2>{report.description}</h2>
                    <h2>{report.assignedTo}</h2>
                </div>
            ))}
        </div>
        <div className={styles.reportsList}>
            {selectedReport && (
                <div className={styles.selectedReport}>
                    <h2>{selectedReport.propertyType}</h2>
                    <h2>{selectedReport.address}</h2>
                    <h2>{selectedReport.description}</h2>
                    <h2>{selectedReport.assignedTo}</h2>
                </div>
            )}
        </div>
    </div>
  )
}
