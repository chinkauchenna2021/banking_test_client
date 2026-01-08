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
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Phone,
  PhoneCall,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Play,
  StopCircle,
  Download,
  Shield,
  Globe,
  Mic,
  Headphones,
  VolumeX,
  AlertCircle,
  Ear,
  TrendingUp,
  AudioLines
} from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function VoicePage() {
  const {
    voiceRequests,
    supportedLanguages,
    supportedVoiceTypes,
    getBalanceRequests,
    requestBalance,
    testVoiceCall,
    formatBalance,
    getCallDuration,
    getLanguageName
  } = useVoice();

  const { toast } = useToast();

  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [requestData, setRequestData] = useState({
    phone_number: '',
    language: 'en',
    voice_type: 'female'
  });

  const [testData, setTestData] = useState({
    phone_number: '',
    message: 'This is a test call from your bank.'
  });

  const languageOptions =
    supportedLanguages.length > 0
      ? supportedLanguages
      : [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'it', name: 'Italian' }
        ];

  const voiceTypeOptions =
    supportedVoiceTypes.length > 0
      ? supportedVoiceTypes
      : [
          { code: 'female', name: 'Female Voice' },
          { code: 'male', name: 'Male Voice' },
          { code: 'neural', name: 'Neural Voice' }
        ];

  useEffect(() => {
    loadVoiceData();
  }, []);

  const loadVoiceData = async () => {
    try {
      await getBalanceRequests();
    } catch (error) {
      console.error('Failed to load voice data:', error);
    }
  };

  const handleRequestBalance = async () => {
    if (!requestData.phone_number) {
      toast({
        title: 'Phone number required',
        description: 'Enter a phone number to receive your balance by call.',
        variant: 'destructive'
      });
      return;
    }

    setIsRequesting(true);
    try {
      await requestBalance(requestData);
      toast({
        title: 'Call initiated',
        description: 'We are calling your phone with your current balance.'
      });
      setRequestData((prev) => ({ ...prev, phone_number: '' }));
    } catch (error: any) {
      toast({
        title: 'Call failed',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Unable to initiate the call.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestCall = async () => {
    if (!testData.phone_number) {
      toast({
        title: 'Phone number required',
        description: 'Enter a phone number to place a test call.',
        variant: 'destructive'
      });
      return;
    }

    setIsTesting(true);
    try {
      await testVoiceCall(testData.phone_number, testData.message);
      toast({
        title: 'Test call initiated',
        description: 'Check your phone for the test call.'
      });
      setShowTestDialog(false);
      setTestData({
        phone_number: '',
        message: 'This is a test call from your bank.'
      });
    } catch (error: any) {
      toast({
        title: 'Test call failed',
        description:
          error?.response?.data?.error ||
          error?.message ||
          'Unable to initiate the test call.',
        variant: 'destructive'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: string, isSuccessful?: boolean) => {
    if (isSuccessful)
      return <CheckCircle2 className='h-4 w-4 text-green-500' />;

    switch (status) {
      case 'completed':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />;
      case 'initiated':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'in_progress':
        return <Play className='h-4 w-4 text-blue-500' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return <Clock className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string, isSuccessful?: boolean) => {
    if (isSuccessful) return 'bg-green-100 text-green-800';

    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDurationSeconds = (request: {
    call_initiated_at?: string;
    call_completed_at?: string;
  }) => {
    if (!request.call_initiated_at || !request.call_completed_at) {
      return 0;
    }

    const start = new Date(request.call_initiated_at).getTime();
    const end = new Date(request.call_completed_at).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return 0;
    }

    return Math.round((end - start) / 1000);
  };

  const getVoiceStats = () => {
    const successful = voiceRequests.filter((r) => r.is_successful);
    const totalDuration = voiceRequests.reduce(
      (sum, request) => sum + getDurationSeconds(request),
      0
    );

    return {
      total: voiceRequests.length,
      successful: successful.length,
      totalDuration,
      successRate:
        voiceRequests.length > 0
          ? (successful.length / voiceRequests.length) * 100
          : 0,
      averageDuration:
        voiceRequests.length > 0 ? totalDuration / voiceRequests.length : 0
    };
  };

  return (
    <PageContainer
      scrollable
      pageTitle='Voice Banking'
      pageDescription='Access your account information through voice calls'
    >
      <div className='space-y-6'>
        {/* Header with Stats */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Voice Banking</h1>
            <p className='text-muted-foreground'>
              {getVoiceStats().total} calls -{' '}
              {getVoiceStats().successRate.toFixed(1)}% success rate
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => setShowTestDialog(true)}>
              <PhoneCall className='mr-2 h-4 w-4' />
              Test Call
            </Button>

            <Button onClick={() => setShowHistory(true)}>
              <History className='mr-2 h-4 w-4' />
              Call History
            </Button>
          </div>
        </div>

        {/* Voice Stats */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Total Calls</p>
                  <div className='text-2xl font-bold'>
                    {getVoiceStats().total}
                  </div>
                </div>
                <PhoneCall className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Successful</p>
                  <div className='text-2xl font-bold'>
                    {getVoiceStats().successful}
                  </div>
                </div>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Success Rate</p>
                  <div className='text-2xl font-bold'>
                    {getVoiceStats().successRate.toFixed(1)}%
                  </div>
                </div>
                <TrendingUp className='h-8 w-8 text-green-500' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm'>Avg Duration</p>
                  <div className='text-2xl font-bold'>
                    {Math.floor(getVoiceStats().averageDuration / 60)}:
                    {String(
                      Math.floor(getVoiceStats().averageDuration % 60)
                    ).padStart(2, '0')}
                  </div>
                </div>
                <Clock className='h-8 w-8 text-orange-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Request Balance */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Request Balance via Phone</CardTitle>
              <CardDescription>
                Get your account balance read to you over a phone call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='space-y-3'>
                  <Label htmlFor='phone_number'>Phone Number</Label>
                  <div className='relative'>
                    <Phone className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      id='phone_number'
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      className='pl-9'
                      value={requestData.phone_number}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          phone_number: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-3'>
                    <Label htmlFor='language'>Language</Label>
                    <Select
                      value={requestData.language}
                      onValueChange={(value) =>
                        setRequestData({
                          ...requestData,
                          language: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select language' />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-3'>
                    <Label htmlFor='voice_type'>Voice Type</Label>
                    <Select
                      value={requestData.voice_type}
                      onValueChange={(value) =>
                        setRequestData({
                          ...requestData,
                          voice_type: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select voice type' />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceTypeOptions.map((voiceType) => (
                          <SelectItem
                            key={voiceType.code}
                            value={voiceType.code}
                          >
                            {voiceType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Shield className='h-4 w-4 text-blue-600' />
                    <span className='font-medium'>Security Information</span>
                  </div>
                  <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
                    <li>Calls are encrypted end-to-end</li>
                    <li>No sensitive information is stored</li>
                    <li>Requires voice authentication</li>
                    <li>Automatic call masking for privacy</li>
                  </ul>
                </div>

                <Button
                  className='w-full'
                  onClick={handleRequestBalance}
                  disabled={isRequesting || !requestData.phone_number}
                >
                  {isRequesting ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <PhoneCall className='mr-2 h-4 w-4' />
                      Call Me with Balance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Balance Calls</CardTitle>
              <CardDescription>Your last 5 balance requests</CardDescription>
            </CardHeader>
            <CardContent>
              {voiceRequests.length > 0 ? (
                <div className='space-y-4'>
                  {voiceRequests.slice(0, 3).map((request) => (
                    <div
                      key={request.id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div>
                        <div className='font-medium'>
                          {format(new Date(request.created_at), 'MMM d')}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {request.to_number}
                        </div>
                      </div>
                      <div className='text-right'>
                        <Badge
                          className={getStatusColor(
                            request.call_status,
                            request.is_successful
                          )}
                        >
                          {request.call_status}
                        </Badge>
                        <div className='text-muted-foreground mt-1 text-xs'>
                          {getCallDuration(request)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {voiceRequests.length > 3 && (
                    <Button variant='outline' className='w-full'>
                      View All ({voiceRequests.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className='py-6 text-center'>
                  <PhoneCall className='text-muted-foreground mx-auto mb-3 h-12 w-12' />
                  <p className='text-muted-foreground'>No recent calls</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Voice Features */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Mic className='h-6 w-6 text-blue-600' />
                </div>
                <div>
                  <h4 className='font-bold'>Voice Commands</h4>
                  <p className='text-muted-foreground text-sm'>
                    Control banking with voice
                  </p>
                </div>
              </div>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Check balance
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Recent transactions
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Transfer money
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Headphones className='h-6 w-6 text-green-600' />
                </div>
                <div>
                  <h4 className='font-bold'>24/7 Support</h4>
                  <p className='text-muted-foreground text-sm'>
                    Always available assistance
                  </p>
                </div>
              </div>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Emergency support
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Multi-language
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Instant response
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-purple-100 p-2'>
                  <Shield className='h-6 w-6 text-purple-600' />
                </div>
                <div>
                  <h4 className='font-bold'>Security Features</h4>
                  <p className='text-muted-foreground text-sm'>
                    Protected voice banking
                  </p>
                </div>
              </div>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Voice biometrics
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  End-to-end encryption
                </li>
                <li className='flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-500' />
                  Fraud detection
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
            <CardDescription>Recent voice banking calls</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voiceRequests.slice(0, 5).map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className='font-medium'>
                      {format(new Date(request.created_at), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <div className='font-mono text-sm'>
                        {request.to_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {getLanguageName(request.language)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getCallDuration(request)}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          request.call_status,
                          request.is_successful
                        )}
                      >
                        <div className='flex items-center gap-1'>
                          {getStatusIcon(
                            request.call_status,
                            request.is_successful
                          )}
                          {request.call_status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right font-semibold'>
                      {formatBalance(request.balance_amount, request.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant='outline' className='w-full'>
              <History className='mr-2 h-4 w-4' />
              View Full History
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Test Call Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Voice Call</DialogTitle>
            <DialogDescription>
              Test the voice banking system with a sample call
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='test-phone'>Test Phone Number</Label>
              <div className='relative'>
                <Phone className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  id='test-phone'
                  type='tel'
                  placeholder='+1 (555) 123-4567'
                  className='pl-9'
                  value={testData.phone_number}
                  onChange={(e) =>
                    setTestData({
                      ...testData,
                      phone_number: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='test-message'>Test Message</Label>
              <Textarea
                id='test-message'
                placeholder='Enter the message to be read...'
                rows={3}
                value={testData.message}
                onChange={(e) =>
                  setTestData({
                    ...testData,
                    message: e.target.value
                  })
                }
              />
            </div>

            <Button
              className='w-full'
              onClick={handleTestCall}
              disabled={isTesting || !testData.phone_number}
            >
              {isTesting ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Calling...
                </>
              ) : (
                'Make Test Call'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Complete Call History</DialogTitle>
            <DialogDescription>All your voice banking calls</DialogDescription>
          </DialogHeader>

          <div className='max-h-[60vh] overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voiceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className='font-medium'>
                      {format(
                        new Date(request.created_at),
                        'MMM d, yyyy h:mm a'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='font-mono text-sm'>
                        {request.to_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {getLanguageName(request.language)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getCallDuration(request)}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          request.call_status,
                          request.is_successful
                        )}
                      >
                        {request.call_status}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {formatBalance(request.balance_amount, request.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
