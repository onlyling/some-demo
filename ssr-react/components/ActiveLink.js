import Router, { withRouter } from 'next/router'
import Link from 'next/link'

const ActiveLink = ({ children, router, href }) => {
  let active = router.pathname === href
  let className = active ? 'active' : ''
  return (
    <Link href={href}>
      <a className={className}>
        {children}
      </a>
    </Link>
  )
}

export default withRouter(ActiveLink)