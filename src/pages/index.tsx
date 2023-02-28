import { useState } from 'react';
import { trpc } from '../libs/trpc';

const NoteCard: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  return (
    <div>
      <div>
        <h4>
          <b>{title}</b>
        </h4>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const utils = trpc.useContext();
  const hello = trpc.hello.useQuery({
    message: 'Yo! tRPC',
  });

  const addNote = trpc.addNote.useMutation({
    async onSuccess() {
      await utils.allNotes.invalidate();
    },
  });
  const allNotes = trpc.allNotes.useQuery();

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleContentChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleSubmitNote = (e: React.SyntheticEvent) => {
    e.preventDefault();

    addNote.mutate({
      title,
      content,
    });
  };

  if (!hello.data) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome to tRPC Note</h1>
      <h2>{hello.data.greeting}</h2>
      <form onSubmit={handleSubmitNote}>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          id='tittle'
          name='title'
          onChange={handleTitleChange}
        />
        <label htmlFor='content'>Content</label>
        <textarea
          id='content'
          cols={30}
          rows={10}
          name='content'
          onChange={handleContentChange}
        ></textarea>
        <button
          style={{
            marginTop: '1rem',
          }}
        >
          Add Note
        </button>
      </form>
      <>
        {allNotes.data &&
          allNotes.data.map(note => (
            <NoteCard key={note.id} title={note.title} content={note.content} />
          ))}
      </>
    </main>
  );
}
