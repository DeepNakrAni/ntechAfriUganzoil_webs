import { useEffect, useState, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Statement from './components/Statement';
import SplitSection from './components/SplitSection';
import MachineIntro from './components/MachineIntro';
import ScrollAssembly from './components/ScrollAssembly';
import Features from './components/Features';
import Specs from './components/Specs';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ParticleField from './components/ParticleField';

const TOTAL_FRAMES = 240;

function preloadImages(onProgress) {
  return new Promise((resolve) => {
    const images = [];
    let loaded = 0;
    
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = img.onerror = () => {
        loaded++;
        onProgress(Math.floor((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          resolve(images);
        }
      };
      images.push(img);
    }
  });
}

function App() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef([]);

  useEffect(() => {
    preloadImages((progress) => {
      setLoadProgress(progress);
    }).then((images) => {
      imagesRef.current = images;
      setTimeout(() => setLoading(false), 500);
    });
  }, []);

  return (
    <>
      <LoadingScreen progress={loadProgress} visible={loading} />
      
      {!loading && (
        <>
          <ParticleField />
          <Navigation />
          
          <main>
            {/* 1. Elite Hero */}
            <Hero />

            {/* 2. Brand Statement */}
            <Statement>
              We believe the finest avocados deserve the finest engineering. 
              Nature provides the <em>gold</em>. We provide the <em>precision</em>.
            </Statement>

            {/* 3. Deep Dive Splits */}
            <SplitSection 
              imgSrc="/avocado-oil.png"
              imgAlt="Cold-Pressed Avocado Oil"
              label="Cold-Pressed"
              heading={<>Purity in Every <em>Drop</em></>}
              body="Extracted entirely below 27°C. By avoiding heat, we preserve the delicate flavor profile, vibrant color, and complete nutritional matrix of the avocado."
            />

            <SplitSection 
              imgSrc="/avocado-flatlay.png"
              imgAlt="Premium Avocado Oil Collection"
              label="The Output"
              heading={<>Crystal Clear <em>Quality</em></>}
              body="99.7% pure extraction. The result is a vibrant, emerald-gold oil with an incredibly high smoke point and unparalleled culinary potential."
              reverse
            />

            {/* 4. Machine Story */}
            <MachineIntro />
            
            <ScrollAssembly 
              totalFrames={TOTAL_FRAMES} 
              images={imagesRef.current} 
            />

            {/* 5. Features & Specs */}
            <Features />
            <Specs />

            {/* 6. Elite CTA */}
            <CTASection />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}

export default App;
