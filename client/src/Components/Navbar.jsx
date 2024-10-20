import React, { useEffect, useState } from 'react'

const Navbar = () => {

    const [screenSize, setScreenSize] = useState(window.innerWidth < 1100);
  
    const updateView = () => {
      setScreenSize(window.innerWidth < 850);
    }

  useEffect(() => {
    window.addEventListener('resize', updateView);
       return () => window.removeEventListener('resize', updateView);
  });

  return (
    <nav className='navbar'>
        <div className='links-list'>
            <a target='_blank' className='link' href='https://portfolio-28ab8.web.app/'>
                {!screenSize ? "Luke's Portfolio" :  <img className='icon' src='../images/resume.png' />}
            </a>
            <a target='_blank' className='link' href='https://chatgpt.com/'>
                {!screenSize ? "ChatGPT" :  <img className='icon' src='../images/chatgpt.png' />}
            </a>
            <a target='_blank' className='link' href='https://github.com/LSoutherton'>
                {!screenSize ? "Luke's Github" :  <img className='icon' src='../images/github.png' />}
            </a>
        </div>
    </nav>
  )
}

export default Navbar