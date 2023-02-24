import { trpc } from '../libs/trpc';

export default function Home() {
  const hello = trpc.hello.useQuery({
    message: 'Yo! tRPC',
  });

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
      <form action=''>
        <label htmlFor='title'>Title</label>
        <input type='text' id='tittle' />
        <label htmlFor='content'>Content</label>
        <textarea id='content' cols={30} rows={10}></textarea>
        <button
          style={{
            marginTop: '1rem',
          }}
        >
          Add Note
        </button>
      </form>
    </main>
  );
}
