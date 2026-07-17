import { useState } from 'react';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ORDER_STATUS_VALUES } from '../constants/orderStatus';

function StyleGuideScreen() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="font-display text-display">Style Guide</h1>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Type Scale</h2>
        <p className="font-display text-display">Display</p>
        <p className="font-display text-h1">Heading 1</p>
        <p className="font-display text-h2">Heading 2</p>
        <p className="font-display text-h3">Heading 3</p>
        <p className="font-display text-h4">Heading 4</p>
        <p className="font-body text-base">Body text in Nunito.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Messages</h2>
        <Message variant="success">Order placed successfully.</Message>
        <Message variant="warning">Your session will expire soon.</Message>
        <Message variant="error">Payment failed. Please try again.</Message>
        <Message variant="info">Delivery may take longer than usual.</Message>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Loader</h2>
        <Button onClick={() => setShowLoader((v) => !v)}>Toggle Loader</Button>
        {showLoader && (
          <div className="h-48">
            <Loader />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <p>Default medium padding card.</p>
          </Card>
          <Card padding="lg">
            <p>Large padding card.</p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Inputs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="name" label="Full Name" placeholder="John Doe" />
          <Input
            name="email"
            label="Email"
            placeholder="john@example.com"
            error="Email is required"
          />
          <Input
            name="address"
            label="Address"
            as="textarea"
            rows={3}
            helperText="Include apartment/unit number if applicable"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-h2">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUS_VALUES.map((status) => (
            <Badge.OrderStatus key={status} status={status} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default StyleGuideScreen;
