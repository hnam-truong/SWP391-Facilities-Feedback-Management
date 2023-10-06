import React from 'react'

export default function ReportPresentaion({ reports }) {
    console.log(reports);
    return (
        <div className='container-content'>
            {reports.map((report) => (
                <div className='report' key={report.id}>
                    <div className='report-box'>
                        <div className='report-box-header'>
                            <div className='report-box-header-user'>
                                <img src={report.avatar} className='report-box-header-user-img' />
                                <div className='report-box-header-user-name'>{report.user}</div>
                            </div>
                            <div className='report-box-header-day'>{report.day}</div>
                        </div>
                        <div className='report-box-content'>
                            <p className='report-box-content-title'>{report.title}</p>
                            <p className='report-box-content-category'>{report.category}</p>
                            <div className='report-box-content-status outstading'>{report.status}</div>
                            <div className='report-box-content-btn'>
                                {/* <p><button className='report-box-content-category-btn-more'>More</button></p> */}
                            </div>
                        </div>
                        <div className='report-box-footer'>
                            <div className='report-box-footer-location'>{report.location}</div>
                            <div className='report-box-footer-time '>{report.time}</div>
                        </div>
                    </div>
                </div>

            ))}
        </div>
    )
}
