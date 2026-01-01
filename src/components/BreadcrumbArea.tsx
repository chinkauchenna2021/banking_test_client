// components/BreadcrumbArea.tsx
import React from 'react';

interface BreadcrumbLink {
  name: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbAreaProps {
  title: string;
  backgroundImage: string;
  links: BreadcrumbLink[];
}

export default function BreadcrumbArea({ title, backgroundImage, links }: BreadcrumbAreaProps) {
  return (
    <section className="breadcrumb-area">
      <div 
        className="breadcrumb-area-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="inner-content">
              <div className="title" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">
                <h2>{title}</h2>
              </div>
              <div className="breadcrumb-menu" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500">
                <ul>
                  {links.map((link, index) => (
                    <li key={index} className={link.active ? 'active' : ''}>
                      <a href={link.href}>{link.name}</a>
                      {index < links.length - 1 && ' / '}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}