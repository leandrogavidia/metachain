"use client";

import Image from "next/image";
import EXIF2 from "exifr";
import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./markdown.module.css";
import { randomString } from "./lib/random-string";

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [responseAssistant, setResponseAssistant] = useState("");

  const { messages, isLoading, setMessages, append } = useChat({
    api: `api/gpt-4o-mini`,
    onFinish: () => setMessages([])
  });

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;

        if (result && typeof result === "string") {
          setCurrentImage(result);
          EXIF2.parse(result).then((output) => {
            console.log(output);
            setMetadata(output);
            append({
              content: JSON.stringify(output),
              role: "user",
              createdAt: new Date(),
              id: randomString(7),
            });
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const lastAssistantMessage = messages
      .filter((m) => m.role == "assistant")
      .at(-1)?.content;
    if (lastAssistantMessage) setResponseAssistant(lastAssistantMessage);
  }, [messages, responseAssistant]);

  return (
    <>
      <header className="bg-primary w-full h-12 px-4 py-2 flex items-center text-text-light font-bold text-xl">
        <p>MetaChain</p>
        <nav></nav>
      </header>
      <main
        className={`h-full w-full flex flex-col sm:flex-row items-center justify-center p-5 gap-x-10`}
      >
        <div className="flex flex-col gap-5 justify-center items-center w-full h-full min-w-80 max-w-80 mx-auto">
          <div className="relative">
            {currentImage && (
              <Image
                width={286}
                height={286}
                className="absolute size-[278px] top-6  object-contain aspect-square left-6"
                src={currentImage}
                alt="Your image"
              />
            )}
            <Image
              width={864}
              height={1059}
              src="/photo-template.png"
              alt="Image template"
              title="Image template"
            />
          </div>
          <label htmlFor="upload-image" className="w-full">
            <div className="w-full bg-transparent border-2 text-center border-primary text-primary font-semibold px-4 py-2 cursor-pointer rounded-full transition-all hover:bg-primary hover:text-text-light">
              Upload image
            </div>
          </label>
          <input
            className="hidden"
            id="upload-image"
            name="image"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          <button className="bg-secondary w-full px-4 py-2 rounded-full font-semibold text-text-light">
            Mint
          </button>
        </div>
        <div className="flex flex-col justify-start items-start bg-zinc-900 text-text-light p-4 rounded-xl max-h-[600px] min-h-[600px] w-full min-w-[420px] max-w-[600px]">
          {metadata && (
            <pre className="max-h-[300px] overflow-auto w-full">{JSON.stringify(metadata, null, 2)}</pre>
          )}
          {
            metadata ? (
              <div className="h-0.5 my-5 bg-zinc-700 w-full"></div>
            ) : ""
          }
          <div>
            {isLoading ? (
              <div className="flex justify-start items-center gap-x-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {responseAssistant ? (
                  <div className="flex max-h-[300px] w-full overflow-auto flex-row justify-start items-start gap-x-6 [&>div:nth-child(2)]:w-full [&>div:nth-child(2)]:max-w-[446px] [&>div:nth-child(2)]:mx-auto [&>div:nth-child(2)]:pr-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className={styles.markdown}
                    >
                      {responseAssistant}
                    </ReactMarkdown>
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="px-4 py-2 w-full h-12 text-text-light flex justify-center items-center font-semibold bg-zinc-900">
        <p>MetaChain 2024</p>
      </footer>
    </>
  );
}
