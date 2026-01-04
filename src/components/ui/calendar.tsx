'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

// Custom icons that meet the DayPicker requirements
const LeftIcon = () => <ChevronLeftIcon className='size-4' />;
const RightIcon = () => <ChevronRightIcon className='size-4' />;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium text-gray-900',
        caption_dropdowns: 'flex gap-2',
        dropdown:
          'bg-white text-gray-900 border border-gray-300 rounded-md px-2 py-1',
        dropdown_month: 'bg-white text-gray-900',
        dropdown_year: 'bg-white text-gray-900',
        dropdown_icon: 'text-gray-900',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-white text-gray-900 border border-gray-300 p-0 hover:bg-gray-50 hover:text-gray-900'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',
        head_cell: 'text-gray-600 rounded-md w-9 font-medium text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 p-0 font-normal text-gray-900 aria-selected:opacity-100 hover:bg-gray-100 hover:text-gray-900'
        ),
        day_range_start:
          'day-range-start aria-selected:bg-blue-600 aria-selected:text-white',
        day_range_end:
          'day-range-end aria-selected:bg-blue-600 aria-selected:text-white',
        day_selected:
          'bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white',
        day_today:
          'bg-blue-50 text-blue-700 font-medium border border-blue-200',
        day_outside: 'text-gray-400 aria-selected:text-gray-400',
        day_disabled: 'text-gray-300 opacity-50',
        day_range_middle:
          'aria-selected:bg-blue-100 aria-selected:text-blue-900',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: LeftIcon,
        IconRight: RightIcon
      }}
      {...props}
    />
  );
}

export { Calendar };
