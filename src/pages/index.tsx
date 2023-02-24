export default function Home() {
  return (
    <main>
      <h1>Welcome to tRPC Note</h1>
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
