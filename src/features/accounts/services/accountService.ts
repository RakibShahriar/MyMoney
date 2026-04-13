import { accountRepository } from '@/src/features/accounts/repository/accountRepository';
import { accountTypeIcons } from '@/src/features/accounts/utils';
import { transactionRepository } from '@/src/features/transactions/repository/transactionRepository';
import type { AccountInput } from '@/src/types/account';
import { createId } from '@/src/utils/id';
import { accountInputSchema } from '@/src/utils/validation';

export const accountService = {
  async listAccounts() {
    return accountRepository.list();
  },

  async getAccountDetails(accountId: string) {
    const [account, transactions] = await Promise.all([
      accountRepository.findById(accountId),
      transactionRepository.list({ accountId }),
    ]);

    return { account, transactions };
  },

  async saveAccount(input: AccountInput) {
    const validated = accountInputSchema.parse({
      ...input,
      icon: input.icon || accountTypeIcons[input.type],
    });

    if (validated.id) {
      const existing = await accountRepository.findById(validated.id);

      if (!existing) {
        throw new Error('Account not found.');
      }

      const balanceDelta = validated.initial_balance - existing.initial_balance;

      await accountRepository.update({
        ...existing,
        name: validated.name,
        type: validated.type,
        icon: validated.icon,
        initial_balance: validated.initial_balance,
        current_balance: existing.current_balance + balanceDelta,
      });

      return accountRepository.findById(validated.id);
    }

    const id = createId();
    await accountRepository.create({ ...validated, id }, validated.initial_balance);
    return accountRepository.findById(id);
  },

  async deleteAccount(accountId: string) {
    const transactionCount = await accountRepository.countTransactions(accountId);

    if (transactionCount > 0) {
      throw new Error('Move or delete transactions before removing this account.');
    }

    await accountRepository.delete(accountId);
  },
};
