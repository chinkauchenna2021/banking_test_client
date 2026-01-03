import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary'); // Check for default variant class
  });

  it('renders with destructive variant', () => {
    render(<Button variant='destructive'>Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive'); // Check for destructive variant class
  });

  it('renders with sm size', () => {
    render(<Button size='sm'>Small Button</Button>);
    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('h-8'); // Check for small size class
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href='/test'>Link Button</a>
      </Button>
    );
    const linkButton = screen.getByRole('link', { name: /link button/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', '/test');
    expect(linkButton.tagName).toBe('A'); // Should render as an anchor tag, not button
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });
});
