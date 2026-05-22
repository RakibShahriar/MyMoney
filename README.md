MyMoney App Documentation
You can find the App in playstore. https://play.google.com/store/apps/details?id=com.goldenliningsolution.mymoney

Quick summary:
- Offline-first personal finance app built with Expo + React Native
- Tracks buy/sell records, budgets, accounts, and monthly analytics
- Uses SQLite for local storage and Zustand for app state

# MyMoney App Documentation

MyMoney is an offline-first personal finance app built with Expo and React Native.
It helps users track buy and sell records, manage budgets, monitor account balances, and review spending analytics.

## Table of Contents

1. Core Features
2. Tech Stack
3. Project Structure
4. Architecture
5. App Flow and Screens
6. Setup and Run
7. Build and Release
8. Data and Storage
9. Developer Notes

## Core Features

- Offline-first finance tracking (no internet needed for normal usage)
- Buy and sell transaction management with filters and search
- Monthly budgeting by category, including an All Expenses budgeting option
- Multiple account management (wallet, bank, cards, etc.)
- Analytics dashboard with expense pie, cash flow, and account charts
- Local settings for currency, decimal precision, and theme mode

## Tech Stack

- Frontend: React Native + Expo
- Language: TypeScript
- Navigation: Expo Router
- Database: Expo SQLite
- State Management: Zustand
- Forms: React Hook Form
- Validation: Zod
- Charts: react-native-svg based chart components
