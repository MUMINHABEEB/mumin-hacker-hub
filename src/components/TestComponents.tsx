import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TestComponents() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3>Button Test</h3>
        <Button variant="default">Default Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Destructive Button</Button>
      </div>
      <div>
        <h3>Badge Test</h3>
        <Badge variant="default">Default Badge</Badge>
        <Badge variant="outline">Outline Badge</Badge>
        <Badge variant="destructive">Destructive Badge</Badge>
      </div>
    </div>
  );
}