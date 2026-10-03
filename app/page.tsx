import { Arena } from './Arena';
import { HowItWorks } from './components/HowItWorks';
import { SiteFooter } from './components/SiteFooter';

export default function Page() {
  return <Arena about={<HowItWorks />} footer={<SiteFooter />} />;
}
