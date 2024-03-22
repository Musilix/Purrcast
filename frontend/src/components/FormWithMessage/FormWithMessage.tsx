import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BadgeAlert, BadgeCheck } from 'lucide-react';

// TODO - move this to a shared file
interface ResponseMessageType {
  type: 'default' | 'success' | 'destructive';
  title: string;
  content: string | React.ReactNode;
}

interface FormComponentType<FormDataType> {
  handleSubmit: (data: FormDataType, endpoint: string) => void;
  setMessage: (message: ResponseMessageType | null) => void;
}

interface UserSession {
  access_token: string;
}

export default function FormWithMessage<FormDataType>({
  FormComponent,
}: {
  FormComponent: React.FC<FormComponentType<FormDataType>>;
}) {
  const [message, setMessage] = useState<ResponseMessageType | null>();
  // TODO - define hook to grab local storage items
  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '',
  ) as UserSession;

  const handleSubmit = async (data: FormDataType, endpoint: string) => {
    await axios
      .post(`${import.meta.env.VITE_API_HOST}${endpoint}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userSession.access_token}`,
        },
      })
      .then((res) => {
        console.log(res.data.postId);
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
      .catch((err: AxiosError) => {
        setMessage({
          type: 'destructive',
          title: 'There was an issue processing your request.',
          content: err.response
            ? `${err.response?.data.message}`
            : 'Something weird happened with our server. Maybe try submitting again later? Sorry!',
        });
      });
  };

  return (
    <>
      <FormComponent handleSubmit={handleSubmit} setMessage={setMessage} />
      {message && (
        <ResponseMessage
          type={message.type}
          title={message.title}
          content={message.content}
        />
      )}
    </>
  );
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
