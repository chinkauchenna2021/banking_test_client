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
        // Layout improvements for better UX
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-3',

        // Header - improved for better UX
        caption: 'flex items-center justify-between pt-2 pb-4 px-1 w-full',
        caption_label: 'text-base font-semibold text-gray-900',
        caption_dropdowns: 'flex gap-2 items-center',
        dropdown:
          'bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors',
        dropdown_month: 'bg-white text-gray-900',
        dropdown_year: 'bg-white text-gray-900',
        dropdown_icon: 'text-gray-600 ml-1',

        // Navigation buttons
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 bg-white text-gray-600 border border-gray-300 p-0 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all'
        ),
        nav_button_previous: '',
        nav_button_next: '',

        // Table layout
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex mb-1',
        head_cell:
          'text-gray-500 text-xs font-medium uppercase tracking-wider w-9 text-center',

        // Rows and cells
        row: 'flex w-full mb-1',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),

        // Day styling - FIXED: Better text color contrast
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 p-0 font-normal text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-colors'
        ),
        day_range_start:
          'day-range-start aria-selected:bg-blue-600 aria-selected:text-white',
        day_range_end:
          'day-range-end aria-selected:bg-blue-600 aria-selected:text-white',

        // SELECTED DAY - FIXED: High contrast text color
        day_selected:
          'bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white',

        day_today:
          'bg-blue-50 text-blue-700 font-medium border border-blue-200',
        day_outside: 'text-gray-400 opacity-50',
        day_disabled: 'text-gray-300 opacity-30 cursor-not-allowed',
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
