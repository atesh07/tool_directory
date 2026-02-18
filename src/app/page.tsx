import React from 'react'
import HeroSection from './Sections/HeroSection/HeroSection'
import PopularTools from './Sections/PopularTools/PopularTools'
import Tutorial from './Sections/Tutorial/Tutorial'

const page = () => {
  return (
    <div>
        <HeroSection/>
        <PopularTools/>
        <Tutorial/>
    </div>
  )
}

export default page