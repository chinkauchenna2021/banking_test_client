'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building,
  Calculator,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Percent,
  Target,
  CreditCard
} from 'lucide-react';
import { useLoan } from '@/hooks/useLoan';
import { UserLoan } from '@/stores/loan.store';
import { useAccount } from '@/hooks/useAccount';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function LoansPage() {
  const { 
    loans, 
    getLoans, 
    applyForLoan, 
    checkEligibility,
    calculateLoan,
    getLoanSummary,
    formatLoanAmount,
    formatInterestRate,
    getLoanStatusColor
  } = useLoan();
  
  const { accounts, getAccounts } = useAccount();
  const { user } = useUser();
  
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [eligibility, setEligibility] = useState<any>(null);
  const [calculatorResult, setCalculatorResult] = useState<any>(null);
  const [loanData, setLoanData] = useState({
    account_id: '',
    loan_type: 'personal',
    amount: '5000',
    term_months: '12',
    purpose: '',
    monthly_income: '',
    employment_status: ''
  });
  
  const [calculatorInputs, setCalculatorInputs] = useState({
    amount: 5000,
    term_months: 12,
    interest_rate: 8.5
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        getLoans(),
        getAccounts()
      ]);
    } catch (error) {
      console.error('Failed to load loan data:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'mortgage': return 'bg-green-100 text-green-800';
      case 'auto': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanStats = () => {
    const activeLoans = loans.filter((l: UserLoan) => l.status === 'active');
    const totalBorrowed = activeLoans.reduce((sum: number, loan: UserLoan) => sum + parseFloat(loan.amount as any), 0);
    const totalRemaining = activeLoans.reduce((sum: number, loan: UserLoan) => sum + parseFloat(loan.remaining_amount as any), 0);
    
    return {
      total: loans.length,
      active: activeLoans.length,
      approved: loans.filter((l: UserLoan) => l.status === 'approved').length,
      totalBorrowed,
      totalRemaining,
      repaymentProgress: totalBorrowed > 0 ? ((totalBorrowed - totalRemaining) / totalBorrowed) * 100 : 0
    };
  };

  return (
    <PageContainer
      scrollable
      pageTitle="Loans"
      pageDescription="Apply for loans and manage existing ones"
    >
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
            <p className="text-muted-foreground">
              {getLoanStats().total} loans • ${getLoanStats().totalBorrowed.toLocaleString()} total borrowed
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowCalculator(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Loan Calculator
            </Button>
            
            <Button onClick={() => setShowApplyDialog(true)}>
              <Building className="h-4 w-4 mr-2" />
              Apply for Loan
            </Button>
          </div>
        </div>

        {/* Loan Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <div className="text-2xl font-bold">{getLoanStats().active}</div>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Borrowed</p>
                  <div className="text-2xl font-bold">
                    {formatLoanAmount(getLoanStats().totalBorrowed, 'USD')}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <div className="text-2xl font-bold">
                    {formatLoanAmount(getLoanStats().totalRemaining, 'USD')}
                  </div>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Repayment</p>
                  <div className="text-2xl font-bold">
                    {getLoanStats().repaymentProgress.toFixed(1)}%
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Loans */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Loans</CardTitle>
                  <CardDescription>Your current and past loans</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loans.length > 0 ? (
                <div className="space-y-4">
                  {loans.slice(0, 3).map((loan: UserLoan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getLoanTypeColor(loan.loan_type)}`}>
                          <Building className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">{loan.loan_number}</h4>
                          <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatLoanAmount(parseFloat(loan.amount), 'USD')}
                        </div>
                        <Badge className={getLoanStatusColor(loan.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(loan.status)}
                            {loan.status}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    You don&apos;t have any active loans
                  </p>
                  <Button 
                    className="mt-3"
                    onClick={() => setShowApplyDialog(true)}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Statements
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Payment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Loan Insurance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Loan Types */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Types</CardTitle>
            <CardDescription>Choose the right loan for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Personal Loan</h4>
                      <p className="text-sm text-muted-foreground">For personal expenses</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-semibold">Up to $50,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Term</span>
                      <span className="font-semibold">6-60 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate</span>
                      <span className="font-semibold">From 5.99%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Business Loan</h4>
                      <p className="text-sm text-muted-foreground">For business growth</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-semibold">Up to $500,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Term</span>
                      <span className="font-semibold">12-84 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate</span>
                      <span className="font-semibold">From 6.99%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Auto Loan</h4>
                      <p className="text-sm text-muted-foreground">For vehicle purchase</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-semibold">Up to $100,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Term</span>
                      <span className="font-semibold">12-84 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate</span>
                      <span className="font-semibold">From 4.99%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Building className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">Mortgage</h4>
                      <p className="text-sm text-muted-foreground">For home purchase</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span className="font-semibold">Up to $2,000,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Term</span>
                      <span className="font-semibold">15-30 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate</span>
                      <span className="font-semibold">From 3.99%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Loan Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>Detailed view of all your loans</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan: UserLoan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.loan_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLoanTypeColor(loan.loan_type)}>
                        {loan.loan_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatLoanAmount(parseFloat(loan.amount), 'USD')}
                    </TableCell>
                    <TableCell>
                      {formatInterestRate(parseFloat(loan.interest_rate))}
                    </TableCell>
                    <TableCell>{loan.term_months} months</TableCell>
                    <TableCell>
                      <Badge className={getLoanStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Make Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Statement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Apply for Loan Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Loan</DialogTitle>
            <DialogDescription>
              Fill out the application form to request a loan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loan Type</Label>
              <Select
                value={loanData.loan_type}
                onValueChange={(value) => setLoanData({
                  ...loanData,
                  loan_type: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage Loan</SelectItem>
                  <SelectItem value="auto">Auto Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Loan Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  className="pl-8"
                  value={loanData.amount}
                  onChange={(e) => setLoanData({
                    ...loanData,
                    amount: e.target.value
                  })}
                  min="100"
                  max="100000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Loan Term (Months)</Label>
              <Input
                type="number"
                value={loanData.term_months}
                onChange={(e) => setLoanData({
                  ...loanData,
                  term_months: e.target.value
                })}
                min="6"
                max="60"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Purpose of Loan</Label>
              <Textarea
                placeholder="Describe what you need the loan for..."
                rows={3}
                value={loanData.purpose}
                onChange={(e) => setLoanData({
                  ...loanData,
                  purpose: e.target.value
                })}
              />
            </div>
            
            <Button className="w-full">
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Calculator</DialogTitle>
            <DialogDescription>
              Calculate your monthly payments and total cost
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loan Amount</Label>
              <Input
                type="number"
                value={calculatorInputs.amount}
                onChange={(e) => setCalculatorInputs({
                  ...calculatorInputs,
                  amount: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Loan Term (Months)</Label>
              <Input
                type="number"
                value={calculatorInputs.term_months}
                onChange={(e) => setCalculatorInputs({
                  ...calculatorInputs,
                  term_months: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={calculatorInputs.interest_rate}
                onChange={(e) => setCalculatorInputs({
                  ...calculatorInputs,
                  interest_rate: parseFloat(e.target.value) || 0
                })}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => {
                // Simple loan calculation
                const principal = calculatorInputs.amount;
                const rate = calculatorInputs.interest_rate / 100 / 12;
                const term = calculatorInputs.term_months;
                
                const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / 
                  (Math.pow(1 + rate, term) - 1);
                const totalPayment = monthlyPayment * term;
                const totalInterest = totalPayment - principal;
                
                setCalculatorResult({
                  monthly_payment: monthlyPayment,
                  total_payment: totalPayment,
                  total_interest: totalInterest
                });
              }}
            >
              Calculate
            </Button>
            
            {calculatorResult && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Payment</span>
                      <span className="font-bold">
                        ${calculatorResult.monthly_payment.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-bold">
                        ${calculatorResult.total_interest.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Total Payment</span>
                      <span className="font-bold text-lg">
                        ${calculatorResult.total_payment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}