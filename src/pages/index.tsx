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
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

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

const schema = z.object({
  title: z.string().min(5, { message: 'Title should have at least 5 letters' }),
  content: z
    .string()
    .min(5, { message: 'Content should have at least 5 letters' }),
});

export default function Home() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: '',
      content: '',
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
        <form
          onSubmit={form.onSubmit(values => {
            addNote.mutate({
              title: values.title,
              content: values.content,
            });

            form.reset();
          })}
        >
          <TextInput
            withAsterisk
            label='Title'
            placeholder='Enter note title'
            {...form.getInputProps('title')}
          />
          <Textarea
            withAsterisk
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
              type='submit'
              fullWidth
              variant='gradient'
              gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            >
              Add Note
            </Button>
          </Group>
        </form>
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
