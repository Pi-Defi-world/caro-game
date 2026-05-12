"use client"

import { DepositModal } from "@/components/common/DepositDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchRecords, resetRecords } from "@/redux/slices/record"
import { ArrowDownIcon, ArrowUpIcon, Eye, EyeOff, Minus, MinusCircle, Plus, PlusCircle, Send } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { InternalTransferModal } from "../wallet/internal-transfer-modal"
import { TrendDown } from "@phosphor-icons/react"

type TransactionType = "Send" | "Receive" | "Withdraw" | "Deposit" | "Win Game" | "Lose Game" | "Draw Game"
type TabType = "All" | "Wallet transfer" | "Game"
type ActionType = "deposit" | "withdraw" | "transfer"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("All")
  const [showBalance, setShowBalance] = useState(true)
  const [modalAction, setModalAction] = useState<ActionType>("deposit")
  const [modalOpen, setModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  const dispatch = useAppDispatch()
  const { records, isLoading, hasMore, currentPage } = useAppSelector((state) => state.records)
  const { currentUser } = useAppSelector((state) => state.auth)

  const observerRef = useRef<HTMLDivElement>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    dispatch(resetRecords())
    dispatch(fetchRecords({ page: 1, limit: 10, category: activeTab === "All" ? undefined : activeTab }))
  }, [dispatch, activeTab])

  const lastRecordElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isLoadingMore) return
      //@ts-ignore
      if (observerRef.current) observerRef.current.disconnect()

        //@ts-ignore
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsLoadingMore(true)
          dispatch(
            fetchRecords({
              page: currentPage + 1,
              limit: 10,
              category: activeTab === "All" ? undefined : activeTab,
            }),
          ).finally(() => {
            setIsLoadingMore(false)
          })
        }
      })

      //@ts-ignore
      if (node) observerRef.current.observe(node)
    },
    [isLoading, isLoadingMore, hasMore, currentPage, activeTab, dispatch],
  )

  const tabs: TabType[] = ["All", "Wallet transfer", "Game"]

  const filteredTransactions = records.filter((transaction) =>
    activeTab === "All" ? true : transaction.category === activeTab,
  )

  const getTransactionIcon = (type: TransactionType, isPositive: boolean) => {
    switch (type) {
      case "Send":
      case "Withdraw":
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />
      case "Receive":
      case "Deposit":
        return <ArrowDownIcon className="w-5 h-5 text-blue-600" />
      case "Win Game":
        return <ArrowDownIcon className="w-5 h-5 text-emerald-500" />
      case "Lose Game":
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />
      case "Draw Game":
        return <ArrowDownIcon className="w-5 h-5 text-gray-500" />
      default:
        return isPositive ? (
          <ArrowDownIcon className="w-5 h-5 text-blue-600" />
        ) : (
          <ArrowUpIcon className="w-5 h-5 text-red-500" />
        )
    }
  }

  const getIconBackground = (type: TransactionType) => {
    switch (type) {
      case "Send":
      case "Withdraw":
      case "Lose Game":
        return "bg-red-100/10"
      case "Receive":
      case "Deposit":
        return "bg-blue-100/10"
      case "Win Game":
        return "bg-emerald-100/10"
      case "Draw Game":
        return "bg-gray-100/10"
      default:
        return "bg-blue-100/10"
    }
  }

  const handleActionClick = (action: ActionType) => {
    if (action === "transfer") {
      setTransferModalOpen(true)
    } else {
      setModalAction(action)
      setModalOpen(true)
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray0">
      <Card className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-[#2e2e4a] my-4">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-300 text-sm font-medium">Total Balance</CardTitle>
            <Button
              onClick={() => setShowBalance(!showBalance)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-1"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="text-3xl md:text-4xl font-bold text-white">
              {showBalance ? `${currentUser?.balance?.toFixed(1) || "0.00"} π` : "*******"}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleActionClick("deposit")}
                className=" bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md"
              >
                {/* <Plus className="w-4 h-4 mr-1" /> */}
                <PlusCircle className="w-5 h-5 ml-1 text-yellow-400" />
                Deposit
              </Button>
              <Button
                onClick={() => handleActionClick("withdraw")}
                className=" bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
              >
                <TrendDown className="w-5 h-5 ml-1 text-white" />
                Withdraw
              </Button>
              {/* <Button
                onClick={() => handleActionClick("transfer")}
                className=" bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium rounded-md"
              >
                <Send className="w-4 h-4 mr-1" />
                Transfer
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-2 px-1 whitespace-nowrap ${
              activeTab === tab ? "text-gray-200 border-b-2 border-gray-200" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-2 mb-[60px]">
        {isLoading && records.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500">No transaction history</p>
          </div>
        ) : (
          <>
            {filteredTransactions.map((transaction, index) => {
              const isLastElement = index === filteredTransactions.length - 1
              return (
                <div
                  key={`${transaction._id}-${index}`}
                  ref={isLastElement ? lastRecordElementRef : null}
                  className="flex items-center mb-2 justify-between px-2 py-1 border-b border-gray-800 bg-gray-800/30 shadow-md rounded-md last:border-b-0"
                >
                  <div className="flex gap-3 justify-center items-center">
                    <div className={`p-2 rounded-lg ${getIconBackground(transaction.type)}`}>
                      {getTransactionIcon(transaction.type, transaction.isPositive)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-400">{transaction.type}</div>
                      {transaction.type.toLowerCase() === "withdraw" && transaction.trx_hash && (
                        <a
                          href={`https://blockexplorer.minepi.com/testnet/transactions/${transaction.trx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          View on block explorer
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          transaction.type === "Draw Game"
                            ? "text-gray-500"
                            : transaction.type === "Deposit" ||
                                transaction.type === "Win Game" ||
                                transaction.type === "Receive"
                              ? "text-emerald-500"
                              : "text-red-500"
                        }`}
                      >
                        {transaction.type === "Deposit" ||
                        transaction.type === "Win Game" ||
                        transaction.type === "Receive"
                          ? "+"
                          : transaction.type === "Draw Game"
                            ? ""
                            : "-"}
                        {transaction.amount.toFixed(2)} π
                      </div>
                      <div className="text-gray-600 text-sm">
                        {new Date(transaction.createdAt)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(",", "")}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Loading indicator for infinite scroll */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
                <span className="ml-2 text-gray-400 text-sm">Loading more...</span>
              </div>
            )}

            {/* End of data indicator */}
            {!hasMore && records.length > 0 && (
              <div className="flex justify-center items-center py-4">
                <p className="text-gray-500 text-sm">No more transactions to load</p>
              </div>
            )}
          </>
        )}
      </div>

      <DepositModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction as "deposit" | "withdraw"}
      />

      <InternalTransferModal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} />
    </div>
  )
}
