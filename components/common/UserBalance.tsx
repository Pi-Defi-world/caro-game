"use client"

import { useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ArrowDownToLine, Coins, PlusCircle } from 'lucide-react';
import { DepositModal } from './DepositDialog';

export const UserBalance = () => {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
    const { currentUser } = useAppSelector((state) => state.auth);

    const handleActionClick = (actionType: 'deposit' | 'withdraw') => {
        if (currentUser) {
            setAction(actionType);
            setIsDepositModalOpen(true);
        }
    };

    return (
        <div className='flex items-center justify-center gap-2'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='cursor-pointer'>
                    <div className="flex relative justify-center items-center rounded-2xl px-1.5 py-0.5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-yellow-500/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                        <img className="w-12 -left-4 -top-2.5 h-12 absolute" src="/3d.png" alt="" />
                        <div className="text-yellow-400 ml-5">{currentUser?.balance.toFixed(1)}</div>
                        <PlusCircle className="w-5 h-5 ml-1 text-yellow-400" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="relative overflow-hidden rounded-xl border-2 border-yellow-500/20 bg-[#0F1226] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <DropdownMenuItem onClick={() => handleActionClick('deposit')} className="relative flex items-center px-4 py-2 text-[#FFF3D4] hover:bg-slate-950 transition-colors">
                        <Coins className="w-4 h-4 mr-2" />
                        Deposit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleActionClick('withdraw')} className="relative flex items-center px-4 py-2 text-[#FFF3D4] hover:bg-slate-950 transition-colors">
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Withdraw
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                action={action}
            />
        </div>
    );
};
