import { ChannelContext } from '@/context/channel.context'
import React from 'react'

const useChannel = () => {
  const context = React.useContext(ChannelContext)
  if (!context) {
    throw new Error('useChannel must be used within a ChannelProvider!');
  }
  return context;
}

export default useChannel
