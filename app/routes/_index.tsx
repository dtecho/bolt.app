// app/routes/_index.tsx

import { type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Mobile Bolt - AI-Powered Mobile Development' },
    { name: 'description', content: 'Create mobile apps with AI assistance' },
  ];
};

export default function Index() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-bolt-elements-background-depth-1">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mobile Bolt</h1>
        <p className="text-xl text-bolt-elements-textSecondary">
          AI-Powered Mobile Development Environment
        </p>
        <p className="mt-4 text-sm text-bolt-elements-textSecondary">
          Phase 1: Foundation & Infrastructure - In Progress
        </p>
      </div>
    </div>
  );
}
