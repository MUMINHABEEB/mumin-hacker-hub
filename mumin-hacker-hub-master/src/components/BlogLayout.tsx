import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PropsWithChildren } from 'react';

const BlogLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
    <Header />
    <main className="flex-1 pt-24">{children}</main>
    <Footer />
  </div>
);

export default BlogLayout;
