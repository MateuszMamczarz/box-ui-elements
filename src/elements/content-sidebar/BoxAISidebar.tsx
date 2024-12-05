/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';

import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import { IconButton } from '@box/blueprint-web';
import { BoxAiContentAnswers, withApiWrapper, type ApiWrapperProps } from '@box/box-ai-content-answers'
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import type { User } from '../../common/types/core';

import messages from '../common/messages';
import sidebarMessages from './messages';

import './BoxAISidebar.scss';

const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);


export interface BoxAISidebarProps extends ApiWrapperProps {
    currentUser: User,
    onExpandClick: () => void,
    fileName: string,
    contentType: string,
}

function BoxAISidebar({ currentUser, onExpandClick, fileName, ...props }: BoxAISidebarProps) {
    const { formatMessage } = useIntl();
    const { createSession, encodedSession, sendQuestion } = props;
    const userInfo = { name: currentUser.name, avatarUrl: currentUser.avatar_url };

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }
    }, []);

    return (
        <SidebarContent
            actions={
                <IconButton
                    aria-label={formatMessage(sidebarMessages.boxAISidebarExpand)}
                    icon={ArrowsExpand}
                    onClick={onExpandClick}
                    size="x-small"
                />
            }
            className="bcs-BoxAISidebar"
            sidebarView={SIDEBAR_VIEW_BOXAI}
            title={formatMessage(messages.sidebarBoxAITitle)}
        >
            <div className="bcs-BoxAISidebar-content">
                <BoxAiContentAnswers 
                    userInfo={userInfo} 
                    className="bcs-BoxAISidebar-contentAnswers" 
                    isSidebarOpen 
                    contentName={fileName} 
                    contentType={props.contentType} 
                    submitQuestion={sendQuestion} 
                    {...props} 
                />
            </div>
        </SidebarContent>
    );
}

export { BoxAISidebar as BoxAISidebarComponent };

const BoxAISidebarDefaultExport: typeof withAPIContext = flow([
    withApiWrapper,
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
])(BoxAISidebar);

export default BoxAISidebarDefaultExport;
