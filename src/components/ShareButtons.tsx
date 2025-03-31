'use client'

import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  LinkedinShareButton, LinkedinIcon,
  PinterestShareButton, PinterestIcon,
  RedditShareButton, RedditIcon,
  TelegramShareButton, TelegramIcon,
  EmailShareButton, EmailIcon
} from 'react-share'

interface ShareButtonsProps {
  url: string
  title: string
  size?: number
  round?: boolean
  className?: string
  showMore?: boolean
  media?: string // For Pinterest sharing - image URL
}

export function ShareButtons({
  url,
  title,
  size = 32,
  round = true,
  className = '',
  showMore = false,
  media = '',
}: ShareButtonsProps) {
  // If no media provided for Pinterest, try to use the OpenGraph image
  const pinterestMedia = media || `${url}/og-image.jpg`;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={size} round={round} />
      </FacebookShareButton>
      
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={size} round={round} />
      </TwitterShareButton>
      
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={size} round={round} />
      </WhatsappShareButton>
      
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={size} round={round} />
      </LinkedinShareButton>

      {showMore && (
        <>
          <PinterestShareButton url={url} media={pinterestMedia} description={title}>
            <PinterestIcon size={size} round={round} />
          </PinterestShareButton>
          
          <RedditShareButton url={url} title={title}>
            <RedditIcon size={size} round={round} />
          </RedditShareButton>
          
          <TelegramShareButton url={url} title={title}>
            <TelegramIcon size={size} round={round} />
          </TelegramShareButton>
          
          <EmailShareButton url={url} subject={title} body={`Check this out: ${url}`}>
            <EmailIcon size={size} round={round} />
          </EmailShareButton>
        </>
      )}
    </div>
  )
} 