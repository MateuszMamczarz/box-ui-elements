/**
 * @flow
 * @file Sidebar Additional Tab FTUX tooltip
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TargetedClickThroughGuideTooltip from '../../../../features/targeting/TargetedClickThroughGuideTooltip';
import messages from './messages';
import type { TargetingApi } from '../../../../features/targeting/types';

import './CommentFormGuideTooltip.scss';

type Props = {
    children: React.Node,
    targetingApi?: TargetingApi,
};

const CommentFormGuideTooltip = ({ children }: Props) => {
    const mockUseTargetingApi = () => ({
        canShow: false,
        onShow: () => {},
        onComplete: () => {},
        onClose: () => {},
    });

    return (
        <TargetedClickThroughGuideTooltip
            title={<FormattedMessage {...messages.persistentOnboardingBoxEditCommentsTooltipTitle} />}
            body={<FormattedMessage {...messages.persistentOnboardingBoxEditCommentsTooltipBody} />}
            useTargetingApi={mockUseTargetingApi}
            shouldTarget
            steps={[3, 3]}
            image={<div className="bsc-CommentForm-avatar-TooltipImage" />}
            primaryButtonProps={{ children: 'Complete', onClick: () => console.log('Complete') }}
            secondaryButtonProps={{ children: 'Back', onClick: () => console.log('back') }}
        >
            {children}
        </TargetedClickThroughGuideTooltip>
    );
};

export default CommentFormGuideTooltip;
