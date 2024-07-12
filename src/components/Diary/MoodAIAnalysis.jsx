  // Aufgabe:
  // Clicking the Gen AI mood analysis should send a request for a Chat Completion 
  // using JSON mode that should return a JSON structure defined by you with a mood/sentiment 
  // analysis based on the content of the entries in the diary. Be creative about what you want to display.

  //We don’t recommend streaming this response as you need the entire JSON document before parsing it,
  //instead, simply should a loading feedback in the button while the request completes. 
  //Disabling the button would also be a good idea 😉

  //Once you get your sentiment analysis JSON object, create a chart to display the data inside the Charts component. 
  //There are tons of graphing libraries out there.

import { useRef } from 'react';
import { Charts } from '@/components/Diary';
import { useState } from 'react';


const MoodAIAnalysis = ({ entry }) => {
  const modalRef = useRef();
  const [aiSummary, setAISummary] = useState(''); 

  // stellt Anfrage an die API und gibt die Antwort zurück
  const handleAISummary = async () => {
    try {
      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'g678y5kyrcibmulz71y4r',
          'provider': 'open-ai',
          'mode': 'production',
        },
        body: JSON.stringify({
          'model': 'gpt-4o',
          'messages': [
            {
              'role': 'system',
              'content': 'You are a therapist and a poet. You are here to analyze my mood by reading my dairy entries but you only speak in poems: ' + entry.content
            }
          ],
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the summary');
      }

      const data = await response.json();
      const summary = data.message.content.trim();
      setAISummary(summary);

    } catch (error) {
      console.error('Error while fetching summary:', error);
    } 
  }; 



  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {aiSummary || "AI SUMMARY GOES HERE..."}
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              <Charts aiSummary={aiSummary} />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI mood analysis ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
