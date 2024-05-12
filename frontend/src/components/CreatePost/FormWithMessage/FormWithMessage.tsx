import { AuthContext } from '@/context/AuthContext';
import axios, { AxiosError } from 'axios';
import { BadgeAlert, BadgeCheck } from 'lucide-react';
import { useContext, useState } from 'react';
import { Redirect } from 'wouter';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';

// TODO - move this to a shared file
interface ResponseMessageType {
  type: 'default' | 'success' | 'destructive';
  title: string;
  content: string | React.ReactNode;
}

interface FormComponentType<FormDataType> {
  handleSubmit: (data: FormDataType, endpoint: string) => void;
  setMessage: (message: ResponseMessageType | null) => void;
  isSubmitting: boolean;
}

interface UserSession {
  access_token: string;
}

export default function FormWithMessage<FormDataType>({
  FormComponent,
}: {
  FormComponent: React.FC<FormComponentType<FormDataType>>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<ResponseMessageType | null>();
  const { session } = useContext(AuthContext);

  // TODO - define hook to grab local storage items, make this prettier
  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '{}',
  ) as UserSession;

  const handleSubmit = async (data: FormDataType, endpoint: string) => {
    setIsSubmitting(true);
    await axios
      .post(`${import.meta.env.VITE_API_HOST}${endpoint}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userSession?.access_token}`,
        },
      })
      .then((res) => {
        setMessage({
          type: 'success',
          title: 'Your post has been uploaded!',
          content: (
            <>
              <p>
                Thanks for
                <span>
                  {' '}
                  <a
                    href={`${import.meta.env.VITE_APP_HOST}/post/${
                      res.data.postId
                    }`}
                  >
                    <b>
                      <u>your post</u>
                    </b>
                  </a>
                </span>
                ! This'll help us build out the best prediction for the weather
                today! 🐱
              </p>
            </>
          ),
        });
      })
      .catch((err: AxiosError<{ message: string }>) => {
        // TODO - use toast?
        setMessage({
          type: 'destructive',
          title: 'There was an issue processing your request.',
          content: err.response
            ? `${err.response?.data.message}`
            : 'Something weird happened with our server. Maybe try submitting again later? Sorry!',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (session && session.user) {
    return (
      <div className="relative">
        <div className="z-0">
          <FormComponent
            handleSubmit={handleSubmit}
            setMessage={setMessage}
            isSubmitting={isSubmitting}
          />
          {message && (
            <ResponseMessage
              type={message.type}
              title={message.title}
              content={message.content}
            />
          )}
        </div>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}

// TODO - put this somewhere else maybe?
function ResponseMessage({ type, title, content }: ResponseMessageType) {
  return (
    <div className="p-2.5 my-5 min-w-[350px]">
      <Alert variant={type}>
        {type === 'destructive' ? <BadgeAlert /> : <BadgeCheck />}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{content}</AlertDescription>
      </Alert>
    </div>
  );
}
