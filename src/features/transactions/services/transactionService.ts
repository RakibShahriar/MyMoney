import { runInTransaction } from '@/src/db/database';
import { accountRepository } from '@/src/features/accounts/repository/accountRepository';
import { transactionRepository } from '@/src/features/transactions/repository/transactionRepository';
import type { TransactionFilters, TransactionInput } from '@/src/types/transaction';
import { signedAmount } from '@/src/utils/math';
import { createId } from '@/src/utils/id';
import { transactionInputSchema } from '@/src/utils/validation';

export const transactionService = {
  async listTransactions(filters: TransactionFilters) {
    return transactionRepository.list(filters);
  },

  async getTransaction(transactionId: string) {
    return transactionRepository.findById(transactionId);
  },

  async saveTransaction(input: TransactionInput) {
    const validated = transactionInputSchema.parse(input);

    if (validated.id) {
      const transactionId = validated.id;
      const existing = await transactionRepository.findById(transactionId);

      if (!existing) {
        throw new Error('Transaction not found.');
      }

      await runInTransaction(async (database) => {
        await accountRepository.adjustBalance(
          existing.account_id,
          -signedAmount(existing.amount, existing.type),
          database
        );
        await transactionRepository.update({ ...validated, id: transactionId }, database);
        await accountRepository.adjustBalance(
          validated.account_id,
          signedAmount(validated.amount, validated.type),
          database
        );
      });

      return transactionRepository.findById(transactionId);
    }

    const id = createId();
    await runInTransaction(async (database) => {
      await transactionRepository.create({ ...validated, id }, database);
      await accountRepository.adjustBalance(
        validated.account_id,
        signedAmount(validated.amount, validated.type),
        database
      );
    });

    return transactionRepository.findById(id);
  },

  async deleteTransaction(transactionId: string) {
    const existing = await transactionRepository.findById(transactionId);

    if (!existing) {
      throw new Error('Transaction not found.');
    }

    await runInTransaction(async (database) => {
      await transactionRepository.delete(transactionId, database);
      await accountRepository.adjustBalance(
        existing.account_id,
        -signedAmount(existing.amount, existing.type),
        database
      );
    });
  },
};
