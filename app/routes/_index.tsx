// app/routes/_index.tsx

import { type MetaFunction } from '@remix-run/node';
import { Workbench } from '~/components/workbench/Workbench.client';

export const meta: MetaFunction = () => {
  return [
    { title: 'Mobile Bolt - AI-Powered Mobile Development' },
    { name: 'description', content: 'Create mobile apps with AI assistance' },
  ];
};

export default function Index() {
  return (
    <div className="h-screen w-screen bg-bolt-elements-background-depth-1">
      <Workbench chatStarted={false} isStreaming={false} />
    </div>
  );
}
