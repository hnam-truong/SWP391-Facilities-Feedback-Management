import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <div className='header'>
        <img src='assets/images/Logo.png' className='header-logo'/>
        <ul className='header-nav'>
          <li><a className='active header-nav-content' href='#home'>Home</a></li>
          <li><a className='header-nav-content' href='#contact'>Create</a></li>
          <li><a className='header-nav-content' href='#news'>History</a></li>
          <li><a className='header-nav-content' href='#about'>Setting</a></li>
        </ul>
        {/* <a className='header-nav-login' href='#login'>Log in</a> */}
      </div>
    )
  }
}
