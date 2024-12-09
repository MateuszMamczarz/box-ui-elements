/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
// @ts-expect-error - TS2305 - Module '"@box/box-ai-content-answers"' has no exported member 'ApiWrapperProps'.
import { BoxAiContentAnswers, withApiWrapper, type ApiWrapperProps } from '@box/box-ai-content-answers'
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { BoxAISidebarContext } from './BoxAISidebarContainer';

import messages from '../common/messages';

import './BoxAISidebar.scss';

const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

function BoxAISidebar(props: ApiWrapperProps) {
    const { formatMessage } = useIntl();
    const { cache, setCacheValue, elementId, userInfo, contentName } = React.useContext(BoxAISidebarContext);
    const { createSession, encodedSession, sendQuestion, questions, stopQuestion, ...rest } = props;
    const { questions: cacheQuestions } = cache;

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }

        if (cacheQuestions.length > 0 && cacheQuestions[cacheQuestions.length-1].isCompleted === false) {
            // if we have cache with question that is not completed resend it to trigger an API
            sendQuestion({prompt: cacheQuestions[cacheQuestions.length-1].prompt});
        }

        return () => {
            // stop API request on unmount (e.g. during switching to another tab)
            stopQuestion();
        }
    }, []);

    if (!cache[encodedSession] && encodedSession) {
        setCacheValue('encodedSession', encodedSession);
    }

    if (!cache[questions] && questions) {
        setCacheValue('questions', questions);
    }

    return (
        <SidebarContent
            className="bcs-BoxAISidebar"
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_BOXAI}
            title={formatMessage(messages.sidebarBoxAITitle)}
        >
            <div className="bcs-BoxAISidebar-content">
                <BoxAiContentAnswers 
                    userInfo={userInfo} 
                    className="bcs-BoxAISidebar-contentAnswers" 
                    contentName={contentName} 
                    questions={questions}
                    submitQuestion={sendQuestion} 
                    stopQuestion={stopQuestion}
                    variant="sidebar"
                    {...rest} 
                />
            </div>
        </SidebarContent>
    );
}

export { BoxAISidebar as BoxAISidebarComponent };

const BoxAISidebarDefaultExport: typeof withAPIContext = flow([
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
    withApiWrapper, // returns only props for Box AI, keep it at the end
])(BoxAISidebar);

export default BoxAISidebarDefaultExport;
