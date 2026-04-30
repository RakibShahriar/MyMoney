import { HeaderHeightContext } from '@react-navigation/elements';
import { router, type Href } from 'expo-router';
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/src/hooks/useAppTheme';

interface ScreenContainerProps extends PropsWithChildren {
  header?: ReactNode;
  scrollable?: boolean;
  swipeNavigation?: {
    previousHref?: Href;
    nextHref?: Href;
  };
}

const ScreenScrollContext = createContext<((target: number | null) => void) | null>(null);

const HORIZONTAL_SWIPE_DISTANCE = 72;
const HORIZONTAL_SWIPE_TRIGGER = 24;
const HORIZONTAL_SWIPE_VELOCITY = 0.35;

export const useScreenScrollToFocusedInput = () => useContext(ScreenScrollContext);

export const ScreenContainer = ({
  children,
  header,
  scrollable = true,
  swipeNavigation,
}: ScreenContainerProps) => {
  const theme = useAppTheme();
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToFocusedInput = useCallback(
    (target: number | null) => {
      if (!scrollable || !target || Platform.OS === 'web') {
        return;
      }

      setTimeout(() => {
        const responder = scrollViewRef.current?.getScrollResponder?.() as
          | {
              scrollResponderScrollNativeHandleToKeyboard?: (
                nodeHandle: number,
                additionalOffset?: number,
                preventNegativeScrollOffset?: boolean
              ) => void;
            }
          | undefined;

        responder?.scrollResponderScrollNativeHandleToKeyboard?.(target, 120, true);
      }, 120);
    },
    [scrollable]
  );

  const panResponder = useMemo(() => {
    if (!swipeNavigation || Platform.OS === 'web') {
      return null;
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontalDistance = Math.abs(gestureState.dx);
        const verticalDistance = Math.abs(gestureState.dy);

        return horizontalDistance > HORIZONTAL_SWIPE_TRIGGER && horizontalDistance > verticalDistance * 1.35;
      },
      onPanResponderRelease: (_, gestureState) => {
        const hasNextSwipe =
          gestureState.dx <= -HORIZONTAL_SWIPE_DISTANCE ||
          (gestureState.dx <= -HORIZONTAL_SWIPE_TRIGGER && gestureState.vx <= -HORIZONTAL_SWIPE_VELOCITY);
        const hasPreviousSwipe =
          gestureState.dx >= HORIZONTAL_SWIPE_DISTANCE ||
          (gestureState.dx >= HORIZONTAL_SWIPE_TRIGGER && gestureState.vx >= HORIZONTAL_SWIPE_VELOCITY);

        if (hasNextSwipe && swipeNavigation.nextHref) {
          router.replace(swipeNavigation.nextHref);
          return;
        }

        if (hasPreviousSwipe && swipeNavigation.previousHref) {
          router.replace(swipeNavigation.previousHref);
        }
      },
    });
  }, [swipeNavigation]);

  const content = (
    <View style={styles.content}>
      {header ? <View style={styles.header}>{header}</View> : null}
      {children}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
          Developed by Rakib Shahriar
        </Text>
        <Text style={[styles.footerSubtext, { color: theme.colors.textMuted }]}>
          rakibshahriar04@gmail.com
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea} {...(panResponder?.panHandlers ?? {})}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView
          style={styles.safeArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={headerHeight}
        >
          <ScreenScrollContext.Provider value={scrollToFocusedInput}>
            {scrollable ? (
              <ScrollView
                ref={scrollViewRef}
                automaticallyAdjustKeyboardInsets
                contentContainerStyle={styles.scrollContent}
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {content}
              </ScrollView>
            ) : (
              content
            )}
          </ScreenScrollContext.Provider>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  header: {
    gap: 10,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
});
