"use client"

import Image from "next/image";
import EXIF2 from 'exifr';
import { useState } from "react";

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;

        if (result && typeof result === "string") {
          setCurrentImage(result)
          EXIF2.parse(result).then(output => {
            console.log(output)
            setMetadata(output)
          })
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <header className="bg-primary w-full h-12 px-4 py-2 flex items-center text-text-light font-bold text-xl">
      <p>MetaChain</p>
      <nav>

      </nav>
    </header>
    <main className={`h-full w-full flex flex-col sm:flex-row items-center justify-center p-5 gap-x-10`}>
      <div className="flex flex-col gap-5 justify-center items-center w-full h-full min-w-80 max-w-80 mx-auto">
        <div className="relative">
          {
            currentImage && (
              <Image width={286} height={286} className="absolute size-[286px] top-5 left-5 object-cover aspect-square" src={currentImage} alt="Your image" />
            )
          }
          <Image width={864} height={1059} src="/photo-template.png" alt="Image template" title="Image template" />
        </div>
        <label htmlFor="upload-image" className="w-full" >
          <div className="w-full bg-transparent border-2 text-center border-primary text-primary font-semibold px-4 py-2 cursor-pointer rounded-full transition-all hover:bg-primary hover:text-text-light">Upload image</div>
        </label>
        <input className="hidden" id="upload-image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
        <button className="bg-secondary w-full px-4 py-2 rounded-full font-semibold text-text-light">
          Mint
        </button>
      </div>
      <div className="bg-zinc-900 text-text-light p-4 rounded-xl overflow-auto max-h-[600px] min-h-[600px] w-full min-w-[420px] max-w-[600px]">
        {
          metadata && (
            <pre className="">{JSON.stringify(metadata, null, 2)}</pre>
          )
        }
      </div>

    </main>
    <footer className="px-4 py-2 w-full h-12 text-text-light flex justify-center items-center font-semibold bg-zinc-900">
      <p>MetaChain 2024</p>
    </footer>
  </>
  );
}
