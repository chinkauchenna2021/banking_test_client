'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calculator,
  Info,
  Home,
  DollarSign,
  Percent,
  Calendar,
  PieChart as PieChartIcon,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonutChart from 'react-donut-chart';
import Layout from '@/components/mainpage/Layout';
import { motion } from 'framer-motion';
// import ShadFooter from '../ShadFooter'
import { useRouter } from 'next/navigation';

export interface LoanCalculation {
  monthlyPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  hoaFees: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number,
  propertyTax: number,
  insurance: number,
  hoaFees: number
): LoanCalculation {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  const principalAndInterest =
    monthlyRate === 0
      ? principal / numberOfPayments
      : (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const monthlyPayment = Math.round(
    principalAndInterest + propertyTax + insurance + hoaFees
  );
  const totalInterest = Math.round(
    principalAndInterest * numberOfPayments - principal
  );
  const totalPayment =
    principal +
    totalInterest +
    (propertyTax + insurance + hoaFees) * numberOfPayments;

  const amortizationSchedule = [];
  let remainingBalance = principal;

  for (let month = 1; month <= Math.min(12, numberOfPayments); month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = principalAndInterest - interestPayment;
    remainingBalance -= principalPayment;

    amortizationSchedule.push({
      month,
      payment: Math.round(principalAndInterest),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      remainingBalance: Math.round(Math.max(0, remainingBalance))
    });
  }

  return {
    monthlyPayment,
    principalAndInterest: Math.round(principalAndInterest),
    propertyTax,
    insurance,
    hoaFees,
    totalInterest,
    totalPayment,
    amortizationSchedule
  };
}

function Page() {
  const [loanAmount, setLoanAmount] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [loanTerm, setLoanTerm] = useState(15);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(350);
  const [insurance, setInsurance] = useState(150);
  const [hoaFees, setHoaFees] = useState(0);

  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const downPaymentPercent = ((downPayment / loanAmount) * 100).toFixed(1);
  const principalAmount = loanAmount - downPayment;

  useEffect(() => {
    const calc = calculateLoan(
      principalAmount,
      interestRate,
      loanTerm,
      propertyTax,
      insurance,
      hoaFees
    );
    setCalculation(calc);
  }, [
    principalAmount,
    interestRate,
    loanTerm,
    propertyTax,
    insurance,
    hoaFees
  ]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleBack = () => {
    router.back();
  };

  const donutChartData = calculation
    ? [
        {
          label: 'Principal & Interest',
          value: calculation.principalAndInterest,
          color: '#3b82f6'
        },
        {
          label: 'Property Tax',
          value: calculation.propertyTax,
          color: '#10b981'
        },
        {
          label: 'Insurance',
          value: calculation.insurance,
          color: '#f59e0b'
        },
        {
          label: 'HOA Fees',
          value: calculation.hoaFees,
          color: '#8b5cf6'
        }
      ].filter((item) => item.value > 0)
    : [];

  return (
    // <Layout>
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50'>
      {/* Simplified Header */}
      <div className='relative mb-8 w-full border-b border-gray-200 py-4'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='ml-8 lg:block'
        >
          <button
            onClick={handleBack}
            className='group flex items-center gap-3 text-sm text-gray-500 transition-all duration-300 hover:text-gray-700'
          >
            <div className='flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm transition-all group-hover:shadow-md'>
              <ArrowLeft className='size-4 transition-transform group-hover:-translate-x-0.5' />
            </div>
            <span className='font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              Go back
            </span>
          </button>
        </motion.div>
      </div>

      {/* Loan Calculator Title */}
      <div className='mb-10 space-y-10'>
        {/* Subtle badge */}
        <div className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700'>
          <Sparkles className='size-3.5' />
          Loan Calculator
        </div>

        <h2 className='text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl lg:text-6xl'>
          Advance Loan Calculator
        </h2>
      </div>

      <main className='container flex min-h-[80vh] items-center justify-center px-4 py-8'>
        <div className='mx-auto max-w-6xl'>
          <Card className='mx-auto border border-gray-200 bg-white/60 p-6 text-black shadow-lg backdrop-blur-sm'>
            <div className='grid gap-8 lg:grid-cols-2'>
              {/* Input Section */}
              <div className='space-y-8'>
                <div>
                  <h2 className='mb-2 text-2xl font-semibold'>Loan Details</h2>
                  <p className='text-gray-600'>
                    Adjust values to see how they affect your payments
                  </p>
                </div>

                {/* Property Value */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Property Value</Label>
                    <div className='text-lg font-semibold'>
                      ${loanAmount.toLocaleString()}
                    </div>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={50000}
                    max={2000000}
                    step={10000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                  />
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>$50K</span>
                    <span>$1M</span>
                    <span>$2M</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Down Payment</Label>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg font-semibold'>
                        ${downPayment.toLocaleString()}
                      </span>
                      <span className='rounded bg-blue-100 px-2 py-1 text-sm text-blue-700'>
                        {downPaymentPercent}%
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[downPayment]}
                    min={0}
                    max={loanAmount * 0.5}
                    step={5000}
                    onValueChange={(value) => setDownPayment(value[0])}
                  />
                </div>

                {/* Loan Term */}
                <div className='space-y-4'>
                  <Label className='font-medium'>Loan Term</Label>
                  <div className='grid grid-cols-3 gap-3'>
                    {[15, 20, 30].map((term) => (
                      <Button
                        key={term}
                        variant={loanTerm === term ? 'default' : 'outline'}
                        onClick={() => setLoanTerm(term)}
                        className={loanTerm === term ? 'bg-blue-600' : ''}
                      >
                        {term} years
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Interest Rate</Label>
                    <div className='text-lg font-semibold'>
                      {interestRate.toFixed(2)}%
                    </div>
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={1}
                    max={15}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                  />
                </div>

                {/* Additional Costs */}
                <div className='space-y-6'>
                  <h3 className='font-medium'>Additional Monthly Costs</h3>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label>Property Tax</Label>
                      <div className='relative'>
                        <DollarSign className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                        <Input
                          type='number'
                          value={propertyTax}
                          onChange={(e) =>
                            setPropertyTax(Number(e.target.value))
                          }
                          className='pl-9'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Insurance</Label>
                      <div className='relative'>
                        <DollarSign className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                        <Input
                          type='number'
                          value={insurance}
                          onChange={(e) => setInsurance(Number(e.target.value))}
                          className='pl-9'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label>HOA Fees (Optional)</Label>
                    <div className='relative'>
                      <DollarSign className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                      <Input
                        type='number'
                        value={hoaFees}
                        onChange={(e) => setHoaFees(Number(e.target.value))}
                        className='pl-9'
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCalculate}
                  className='w-full bg-blue-400 py-3 text-sm hover:bg-blue-700'
                >
                  <Calculator className='mr-2 h-5 w-5' />
                  Calculate Full Details
                </Button>
              </div>

              {/* Results Preview */}
              <div className='space-y-6'>
                {/* Summary Card */}
                <Card className='bg-white text-black'>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <Home className='h-5 w-5 text-blue-600' />
                      <div>
                        <CardTitle>Loan Summary</CardTitle>
                        <CardDescription>Based on your inputs</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Loan Amount</p>
                        <p className='text-xl font-semibold'>
                          ${principalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Down Payment</p>
                        <p className='text-xl font-semibold text-green-600'>
                          ${downPayment.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Interest Rate</p>
                        <p className='text-xl font-semibold'>
                          {interestRate.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Loan Term</p>
                        <p className='text-xl font-semibold'>
                          {loanTerm} years
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Breakdown */}
                <Card className='bg-white text-black'>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <PieChartIcon className='h-5 w-5 text-emerald-600' />
                      <div>
                        <CardTitle>Payment Breakdown</CardTitle>
                        <CardDescription>
                          Monthly cost distribution
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex items-center justify-center'>
                    {calculation && (
                      <div className='flex flex-col items-center'>
                        <div className='flexjustify-center relative w-full max-w-xs items-center'>
                          <DonutChart
                            data={donutChartData}
                            colors={donutChartData.map((d) => d.color)}
                            strokeColor='transparent'
                            innerRadius={0.7}
                            outerRadius={0.9}
                            width={280}
                            height={280}
                            legend={false}
                            formatValues={(value) =>
                              `$${value.toLocaleString()}`
                            }
                          />
                          {/* <div className="absolute inset-0 flex flex-col items-center  justify-center">
                            <p className="text-sm text-gray-600 mt-10">Monthly Payment</p>
                            <p className="text-3xl font-bold ">${calculation.monthlyPayment.toLocaleString()}</p>
                          </div> */}
                        </div>
                        <div className='mt-14 w-full space-y-3'>
                          {donutChartData.map((item, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between'
                            >
                              <div className='flex items-center gap-2'>
                                <div
                                  className='h-3 w-3 rounded'
                                  style={{ backgroundColor: item.color }}
                                />
                                <span>{item.label}</span>
                              </div>
                              <span className='font-medium'>
                                ${item.value.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Note */}
                <Card className='border-blue-200 bg-blue-50'>
                  <CardContent className='pt-6'>
                    <div className='flex gap-3'>
                      <Info className='h-5 w-5 flex-shrink-0 text-blue-600' />
                      <p className='text-sm text-blue-700'>
                        This calculator provides estimates. Actual rates may
                        vary based on credit score, location, and lender
                        policies.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>
              Complete Loan Analysis
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown of your loan payment schedule and costs
            </DialogDescription>
          </DialogHeader>

          {calculation && (
            <div className='space-y-6'>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='overview'>Overview</TabsTrigger>
                  <TabsTrigger value='schedule'>Payment Schedule</TabsTrigger>
                  <TabsTrigger value='breakdown'>Cost Breakdown</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value='overview' className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <Card>
                      <CardContent className='pt-6'>
                        <p className='text-sm text-gray-600'>
                          Total Loan Amount
                        </p>
                        <p className='text-2xl font-bold'>
                          ${principalAmount.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className='pt-6'>
                        <p className='text-sm text-gray-600'>Monthly Payment</p>
                        <p className='text-2xl font-bold text-blue-600'>
                          ${calculation.monthlyPayment.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className='pt-6'>
                        <p className='text-sm text-gray-600'>
                          Total Interest Paid
                        </p>
                        <p className='text-2xl font-bold text-amber-600'>
                          ${calculation.totalInterest.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {donutChartData.map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center gap-3'>
                              <div
                                className='h-3 w-3 rounded'
                                style={{ backgroundColor: item.color }}
                              />
                              <span>{item.label}</span>
                            </div>
                            <div className='text-right'>
                              <p className='font-semibold'>
                                ${item.value.toLocaleString()}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {Math.round(
                                  (item.value / calculation.monthlyPayment) *
                                    100
                                )}
                                % of payment
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Schedule Tab */}
                <TabsContent value='schedule'>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Amortization Schedule (First 12 Months)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='overflow-x-auto'>
                        <table className='w-full'>
                          <thead>
                            <tr className='border-b'>
                              <th className='py-3 text-left'>Month</th>
                              <th className='py-3 text-left'>Payment</th>
                              <th className='py-3 text-left'>Principal</th>
                              <th className='py-3 text-left'>Interest</th>
                              <th className='py-3 text-left'>
                                Remaining Balance
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculation.amortizationSchedule.map((row) => (
                              <tr
                                key={row.month}
                                className='border-b hover:bg-gray-50'
                              >
                                <td className='py-3'>{row.month}</td>
                                <td className='py-3 font-medium'>
                                  ${row.payment.toLocaleString()}
                                </td>
                                <td className='py-3 text-green-600'>
                                  ${row.principal.toLocaleString()}
                                </td>
                                <td className='py-3 text-amber-600'>
                                  ${row.interest.toLocaleString()}
                                </td>
                                <td className='py-3'>
                                  ${row.remainingBalance.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Cost Breakdown Tab */}
                <TabsContent value='breakdown'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className='bg-black'>
                      <div className='space-y-3'>
                        <div className='flex justify-between rounded-sm bg-gray-50 p-3 text-black'>
                          <span>Principal Amount</span>
                          <span className='font-medium'>
                            ${principalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between rounded bg-gray-50 p-3 text-black'>
                          <span>Total Interest ({loanTerm} years)</span>
                          <span className='font-medium text-amber-600'>
                            ${calculation.totalInterest.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between rounded bg-gray-50 p-3 text-black'>
                          <span>Total Property Tax</span>
                          <span className='font-medium text-emerald-600'>
                            $
                            {(
                              calculation.propertyTax *
                              loanTerm *
                              12
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between rounded bg-gray-50 p-3 text-black'>
                          <span>Total Insurance</span>
                          <span className='font-medium text-blue-600'>
                            $
                            {(
                              calculation.insurance *
                              loanTerm *
                              12
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className='mt-4 flex justify-between border-t p-3'>
                          <span className='text-lg font-semibold'>
                            Total Cost of Loan
                          </span>
                          <span className='text-xl font-bold'>
                            ${calculation.totalPayment.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className='flex gap-3 border-t pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setShowResults(false)}
                  className='flex-1'
                >
                  Close
                </Button>
                <Button className='flex-1 bg-blue-600 hover:bg-blue-700'>
                  Save Calculation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    // </Layout>
  );
}

export default Page;
