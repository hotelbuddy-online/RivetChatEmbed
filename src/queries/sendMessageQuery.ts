import { MessageType } from '@/components/Bot';
import { sendRequest } from '@/utils/index';

export type IncomingInput = {
  question: string;
  history: MessageType[];
  overrideConfig?: Record<string, unknown>;
  socketIOClientId?: string;
  chatId?: string;
  fileName?: string; // Only for assistant
};

export type MessageRequest = {
  chatflowid?: string;
  model?: string;
  apiHost?: string;
  body?: IncomingInput;
};
export const sendMessageQuery = async ({ chatflowid, apiHost = 'http://localhost:3000', body }: MessageRequest) => {
  console.log('sending message query - chatflowid', chatflowid);
  console.log('sending message query - apihost', apiHost);
  console.log('sending message query - body', JSON.stringify(body));

  const messageout = {
    method: 'POST',
    url: `${apiHost}/chat/completions`,
    body: {
      model: chatflowid,
      messages: (body || {}).history || [],
    },
    token: 'some-key',
  };

  try {
    const result = await sendRequest<any>(messageout);
    console.log('message response:', JSON.stringify(result));
    console.log('sent message:', JSON.stringify(messageout));
    return result; // Return the result object directly
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message' }; // Return an error object
  }
};

export const getChatbotConfig = ({ chatflowid, apiHost = 'http://localhost:3000' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/public-chatbotConfig/${chatflowid}`,
  });

export const isStreamAvailableQuery = ({ chatflowid, apiHost = 'http://localhost:3000' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/chatflows-streaming/${chatflowid}`,
  });

export const sendFileDownloadQuery = ({ apiHost = 'http://localhost:3000', body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/openai-assistants-file`,
    body,
    type: 'blob',
  });
