import { BankTabItem } from "@/components/BankTabItem";
import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  const rowsPerPage = 15;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
      </div>
      <div className="space-y-6">
        <Tabs defaultValue={appwriteItemId} className="w-full">
          <TabsList className="flex justify-center items-center mb-10 lg:justify-start lg:items-start">
            {accountsData.map((account: Account) => (
              <TabsTrigger key={account.id} value={account.appwriteItemId}>
                <BankTabItem
                  key={account.id}
                  account={account}
                  appwriteItemId={appwriteItemId}
                />
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="transactions-account">
            <div className="flex flex-col gap-2">
              <h2 className="text-18 font-bold text-white">
                {account?.data.name}
              </h2>
              <p className="text-14 text-blue-25">
                {account?.data.officialName}
              </p>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                ●●●● ●●●● ●●●● {account?.data.mask}
              </p>
            </div>
            <div className="transactions-account-balance">
              <p className="text-14">Current Balance</p>
              <p className="text-24 text-center font-bold">
                {formatAmount(account?.data.currentBalance)}
              </p>
            </div>
          </div>
          <section className="flex w-full flex-col gap-6">
            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 2-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
          </section>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionHistory;
