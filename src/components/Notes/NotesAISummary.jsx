import { useRef, useState } from 'react';

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const resultsRef = useRef();
  const [stream, setStream] = useState(false);

  const handleAISummary = async () => {
    try  {
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
        'stream': stream,
        'messages': [
          {
            'role': 'user',
            'content': 'Create a summary of my notes but you only speak in haiku: ' + notes.content
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch the summary');
    }


    const data = await response.json();


  } catch (error) {
    console.error('Error while fetching summary:', error);
  } 
}

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
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen summary</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => setStream(p => !p)}
              />
            </label>

            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div
              className='textarea textarea-success w-full h-[400px] overflow-y-scroll'
              ref={resultsRef}
            >
              AI SUMMARY GOES HERE
            </div>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI summary ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
