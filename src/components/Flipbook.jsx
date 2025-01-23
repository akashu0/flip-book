import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "./bes.pdf";
// import pdf from './ByteBeatJan2024.pdf';
import Loader from "./Loader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef((props, ref) => {
  return (
    <div
      className=" bg-transparent  flex justify-center items-center"
      ref={ref}
    >
      <Document file={pdf}>
        <Page
          pageNumber={props.number}
          width={props.width}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
    </div>
  );
});

Pages.displayName = "Pages";

function Flipbook() {
  const [loading, setLoading] = useState(false);
  let audio = new Audio("/pagesound.mp3");
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const bookRef = useRef();

  useEffect(() => {
    setLoading(true);
    const fetchPDFData = async () => {
      const pdfDocument = await pdfjs.getDocument(pdf).promise;
      setNumPages(pdfDocument.numPages);
      setLoading(false);
    };

    fetchPDFData();
  }, []);

  useEffect(() => {}, [numPages]);

  const handleNextPage = () => {
    if (currentPage < numPages - 1) {
      audio.play();
      bookRef.current.pageFlip().flipNext();
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      audio.play();
      bookRef.current.pageFlip().flipPrev();
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col px-32 bg-gradient-to-bl from-gray-50 to-slate-500 overflow-hidden">
      {loading ? (
        <Loader />
      ) : (
        <div className=" flex justify-between items-center h-screen   ">
          {numPages && (
            <>
              <button
                className="transform  bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-400 z-10"
                onClick={handlePrevPage}
              >
                &larr;
              </button>
              <div>
                <HTMLFlipBook
                  width={1000}
                  height={560}
                  ref={bookRef}
                  className="shadow-lg rounded-md  "
                >
                  {[...Array(numPages).keys()].map((pNum) => (
                    <Pages key={pNum} number={pNum + 1} width={1000} />
                  ))}
                </HTMLFlipBook>
              </div>
              <button
                className=" transform  bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-400 z-10"
                onClick={handleNextPage}
              >
                &rarr;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Flipbook;
