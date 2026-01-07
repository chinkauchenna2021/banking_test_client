'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  FileText,
  User,
  Building,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  Star,
  ThumbsUp,
  ThumbsDown,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { useContact } from '@/hooks/useContact';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const {
    categories,
    faqs,
    isLoading,
    supportHours,
    responseTime,
    sendMessage,
    getFaqs,
    getSupportHours,
    getResponseTime,
    validateContactForm,
    searchFaqs
  } = useContact();

  const { user } = useUser();
  const { toast } = useToast();

  const [selectedTab, setSelectedTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const getDefaultMessageData = () => ({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    type: 'general',
    priority: 'normal'
  });

  const [messageData, setMessageData] = useState(getDefaultMessageData());

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      await Promise.all([getFaqs(), getSupportHours(), getResponseTime()]);
    } catch (error) {
      console.error('Failed to load contact data:', error);
      toast({
        title: 'Failed to load support data',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'account':
        return 'bg-blue-100 text-blue-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const contactStats = {
    responseTime: responseTime?.average_hours || 24,
    supportLanguages: ['English', 'Spanish', 'French', 'German', 'Chinese'],
    availability: '24/7 for emergency, Mon-Fri 9-5 for general inquiries'
  };

  const fallbackFaqs = [
    {
      question: 'How do I open a new account?',
      answer:
        'You can open a new account through our website or mobile app. Navigate to the Accounts section and select New Account. You will need to provide basic information and verify your identity.',
      category: 'Account'
    },
    {
      question: 'Is my money safe with your bank?',
      answer:
        'Yes, all deposits are insured up to $250,000 by the FDIC. We use bank-level encryption and security measures to protect your information.',
      category: 'Security'
    },
    {
      question: 'How long do transfers take?',
      answer:
        'Internal transfers are instant. External transfers typically take 1-3 business days. International transfers may take 3-5 business days.',
      category: 'Transactions'
    }
  ];

  const baseFaqs = faqs.length ? faqs : fallbackFaqs;
  const searchedFaqs = searchQuery
    ? faqs.length
      ? searchFaqs(searchQuery)
      : baseFaqs.filter((faq) => {
          const query = searchQuery.toLowerCase();
          return (
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
          );
        })
    : baseFaqs;

  const filteredFaqs = searchedFaqs.filter((faq) =>
    selectedCategory === 'all' ? true : faq.category === selectedCategory
  );

  const categoryOptions = Array.from(
    new Set(
      (categories.length
        ? categories.map((category) => category.name)
        : baseFaqs.map((faq) => faq.category)
      ).filter(Boolean)
    )
  );

  const supportHoursData = supportHours || {
    email: '24/7 response within 24 hours',
    phone: 'Mon-Fri: 8:00 AM - 8:00 PM EST\nSat-Sun: 9:00 AM - 5:00 PM EST',
    chat: '24/7 availability for all customers',
    holidays: [
      "New Year's Day: Closed",
      'Memorial Day: Limited support',
      'Independence Day: Closed',
      'Labor Day: Limited support',
      'Thanksgiving: Closed',
      'Christmas Day: Closed'
    ]
  };

  const phoneLines = supportHoursData.phone.split('\n');
  const isSending = isSubmitting || isLoading;

  const handleSendMessage = async () => {
    const validation = validateContactForm(messageData);
    if (!validation.valid) {
      toast({
        title: 'Please check your message',
        description: validation.errors[0],
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      await sendMessage(messageData);
      toast({
        title: 'Message sent',
        description: 'Our support team will get back to you soon.'
      });
      setShowSuccess(true);
      setMessageData(getDefaultMessageData());
    } catch (error: any) {
      toast({
        title: 'Failed to send message',
        description: error?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (title: string, description: string) => {
    toast({ title, description });
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Contact & Support'
      pageDescription='Get help, submit inquiries, or provide feedback'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Contact & Support
            </h1>
            <p className='text-muted-foreground'>
              We&apos;re here to help. Get in touch with our support team.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() =>
                handleQuickAction(
                  'Help Center',
                  'We can connect you with our support knowledge base.'
                )
              }
            >
              <LifeBuoy className='mr-2 h-4 w-4' />
              Help Center
            </Button>
          </div>
        </div>

        {/* Support Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Average Response
                  </p>
                  <div className='text-2xl font-bold'>
                    {contactStats.responseTime}h
                  </div>
                </div>
                <Clock className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Support Languages
                  </p>
                  <div className='text-2xl font-bold'>
                    {contactStats.supportLanguages.length}
                  </div>
                </div>
                <Globe className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Availability</p>
                  <div className='text-2xl font-bold'>24/7</div>
                </div>
                <Shield className='h-8 w-8 text-purple-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <TabsList className='mb-6'>
            <TabsTrigger value='contact'>Contact Us</TabsTrigger>
            <TabsTrigger value='faq'>FAQs</TabsTrigger>
            <TabsTrigger value='support'>Support Hours</TabsTrigger>
          </TabsList>

          <TabsContent value='contact'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              {/* Contact Form */}
              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-3'>
                        <Label htmlFor='name'>Full Name *</Label>
                        <div className='relative'>
                          <User className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                          <Input
                            id='name'
                            className='pl-9'
                            value={messageData.name}
                            onChange={(e) =>
                              setMessageData({
                                ...messageData,
                                name: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className='space-y-3'>
                        <Label htmlFor='email'>Email Address *</Label>
                        <div className='relative'>
                          <Mail className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                          <Input
                            id='email'
                            type='email'
                            className='pl-9'
                            value={messageData.email}
                            onChange={(e) =>
                              setMessageData({
                                ...messageData,
                                email: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-3'>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <div className='relative'>
                          <Phone className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                          <Input
                            id='phone'
                            type='tel'
                            className='pl-9'
                            value={messageData.phone}
                            onChange={(e) =>
                              setMessageData({
                                ...messageData,
                                phone: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className='space-y-3'>
                        <Label htmlFor='company'>Company</Label>
                        <div className='relative'>
                          <Building className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                          <Input
                            id='company'
                            className='pl-9'
                            value={messageData.company}
                            onChange={(e) =>
                              setMessageData({
                                ...messageData,
                                company: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-3'>
                        <Label htmlFor='type'>Inquiry Type *</Label>
                        <Select
                          value={messageData.type}
                          onValueChange={(value) =>
                            setMessageData({
                              ...messageData,
                              type: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='technical'>
                              Technical Support
                            </SelectItem>
                            <SelectItem value='billing'>
                              Billing & Payments
                            </SelectItem>
                            <SelectItem value='account'>
                              Account Issues
                            </SelectItem>
                            <SelectItem value='general'>
                              General Inquiry
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-3'>
                        <Label htmlFor='priority'>Priority Level</Label>
                        <Select
                          value={messageData.priority}
                          onValueChange={(value) =>
                            setMessageData({
                              ...messageData,
                              priority: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select priority' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='low'>Low</SelectItem>
                            <SelectItem value='normal'>Normal</SelectItem>
                            <SelectItem value='high'>High</SelectItem>
                            <SelectItem value='urgent'>Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='subject'>Subject *</Label>
                      <Input
                        id='subject'
                        value={messageData.subject}
                        onChange={(e) =>
                          setMessageData({
                            ...messageData,
                            subject: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='message'>Message *</Label>
                      <Textarea
                        id='message'
                        rows={5}
                        placeholder='Please describe your inquiry in detail...'
                        value={messageData.message}
                        onChange={(e) =>
                          setMessageData({
                            ...messageData,
                            message: e.target.value
                          })
                        }
                      />
                    </div>

                    {showSuccess && (
                      <div className='rounded-md bg-green-50 p-3 text-sm text-green-700'>
                        Message sent successfully. We will respond shortly.
                      </div>
                    )}
                    <Button
                      className='w-full'
                      onClick={handleSendMessage}
                      disabled={isSending}
                    >
                      <Send className='mr-2 h-4 w-4' />
                      {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Other ways to reach us</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-blue-600' />
                      <div>
                        <div className='font-medium'>Phone Support</div>
                        <div className='text-muted-foreground text-sm'>
                          1-800-123-4567
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-green-600' />
                      <div>
                        <div className='font-medium'>Email Support</div>
                        <div className='text-muted-foreground text-sm'>
                          support@bank.com
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <MessageSquare className='h-4 w-4 text-purple-600' />
                      <div>
                        <div className='font-medium'>Live Chat</div>
                        <div className='text-muted-foreground text-sm'>
                          Available 24/7
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border-t pt-4'>
                    <div className='text-muted-foreground mb-2 text-sm'>
                      Emergency Contact
                    </div>
                    <div className='space-y-1'>
                      <div className='text-lg font-bold'>1-800-911-4567</div>
                      <div className='text-sm'>
                        For lost/stolen cards or suspected fraud
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='faq'>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-center'>
                  <div className='relative flex-1'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      placeholder='Search FAQs...'
                      className='pl-9'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className='md:w-56'>
                      <SelectValue placeholder='Filter by category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filteredFaqs.length ? (
                  <Accordion type='single' collapsible className='space-y-4'>
                    {filteredFaqs.map((faq) => (
                      <AccordionItem
                        key={faq.question}
                        value={faq.question}
                        className='rounded-lg border px-4'
                      >
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex items-start gap-3 text-left'>
                            <HelpCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600' />
                            <div>
                              <div className='font-semibold'>
                                {faq.question}
                              </div>
                              <Badge variant='outline' className='mt-1'>
                                {faq.category}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='pt-2 pb-4'>
                          <div className='text-muted-foreground pl-8'>
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className='text-muted-foreground text-sm'>
                    No FAQs found for the selected filters.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='support'>
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
                <CardDescription>
                  Our availability for different support channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <Phone className='h-5 w-5 text-blue-600' />
                      <div>
                        <h3 className='font-semibold'>Phone Support</h3>
                        <p className='text-muted-foreground text-sm'>
                          {phoneLines.map((line, index) => (
                            <span key={`${line}-${index}`}>
                              {line}
                              {index < phoneLines.length - 1 ? <br /> : null}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Mail className='h-5 w-5 text-green-600' />
                      <div>
                        <h3 className='font-semibold'>Email Support</h3>
                        <p className='text-muted-foreground text-sm'>
                          {supportHoursData.email}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <MessageSquare className='h-5 w-5 text-purple-600' />
                      <div>
                        <h3 className='font-semibold'>Live Chat</h3>
                        <p className='text-muted-foreground text-sm'>
                          {supportHoursData.chat}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='border-t pt-4'>
                    <h4 className='mb-2 font-semibold'>Holiday Schedule</h4>
                    <div className='text-muted-foreground space-y-2 text-sm'>
                      {supportHoursData.holidays.map((holiday) => (
                        <div key={holiday}>- {holiday}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Resources */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <FileText className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <h4 className='font-bold'>User Guides</h4>
                  <p className='text-muted-foreground text-sm'>
                    Step-by-step tutorials
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() =>
                  handleQuickAction('User Guides', 'Opening the latest guides.')
                }
              >
                View Guides
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Download className='h-6 w-6 text-green-600' />
                </div>
                <div>
                  <h4 className='font-bold'>Download Forms</h4>
                  <p className='text-muted-foreground text-sm'>
                    Banking forms & documents
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() =>
                  handleQuickAction(
                    'Download Forms',
                    'Preparing forms and documents for download.'
                  )
                }
              >
                Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-purple-100 p-2'>
                  <Globe className='h-6 w-6 text-purple-600' />
                </div>
                <div>
                  <h4 className='font-bold'>Community Forum</h4>
                  <p className='text-muted-foreground text-sm'>
                    Connect with users
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() =>
                  handleQuickAction(
                    'Community Forum',
                    'Redirecting you to the community forum.'
                  )
                }
              >
                Visit Forum
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-red-100 p-2'>
                  <AlertCircle className='h-6 w-6 text-red-600' />
                </div>
                <div>
                  <h4 className='font-bold'>Report Issue</h4>
                  <p className='text-muted-foreground text-sm'>
                    Security or technical issues
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() =>
                  handleQuickAction(
                    'Report Issue',
                    'We will open a secure report form for you.'
                  )
                }
              >
                Report Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
