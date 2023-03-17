import { trpc } from '../libs/trpc';
import {
  Box,
  Button,
  Container,
  Group,
  TextInput,
  Title,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';

const NoteCard: React.FC<{
  id: number;
  title: string;
  content: string;
  deleteNote: (id: number) => void;
}> = ({ title, content, deleteNote, id }) => {
  return (
    <div onClick={() => deleteNote(id)}>
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
  const form = useForm({
    initialValues: {
      title: '',
      content: '',
    },
    validate: {
      title: value =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
      content: value =>
        value.length < 2 ? 'Name must have at least 2 letters' : null,
    },
  });

  const utils = trpc.useContext();
  const hello = trpc.hello.useQuery({
    text: 'Yo! tRPC',
  });

  const addNote = trpc.addNote.useMutation({
    async onSuccess() {
      await utils.allNotes.invalidate();
    },
  });

  const deleteNote = trpc.deleteNote.useMutation({
    async onSuccess() {
      await utils.allNotes.invalidate();
    },
  });

  const allNotes = trpc.allNotes.useQuery();

  const handleSubmitNote = (e: React.SyntheticEvent) => {
    e.preventDefault();

    addNote.mutate({
      title: form.values.title,
      content: form.values.content,
    });
  };

  const handleDeleteNote = async (noteId: number) => {
    deleteNote.mutate({ id: noteId });
  };

  if (!hello.data) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <Container>
      <Title order={1}>Welcome to tRPC Note</Title>
      <Title order={2}>{hello.data.greeting}</Title>
      <Box maw={320} mx='auto'>
        <TextInput
          label='Title'
          placeholder='Enter note title'
          {...form.getInputProps('title')}
        />
        <Textarea
          mt='md'
          label='Content'
          placeholder='Enter content'
          autosize
          minRows={4}
          maxRows={10}
          {...form.getInputProps('content')}
        />

        <Group position='center' mt='xl'>
          <Button
            fullWidth
            variant='gradient'
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            onClick={e => {
              handleSubmitNote(e);
              form.reset();
            }}
          >
            Add Note
          </Button>
        </Group>
      </Box>
      <>
        {allNotes.data &&
          allNotes.data.map(note => (
            <NoteCard
              id={note.id}
              key={note.id}
              title={note.title}
              content={note.content}
              deleteNote={handleDeleteNote}
            />
          ))}
      </>
    </Container>
  );
}
