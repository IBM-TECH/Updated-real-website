import { useEffect } from "react";
import { siteSettings } from "@/lib/content";

export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteSettings.siteTitle}` : siteSettings.siteTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description || siteSettings.seoDescription);
    } else {
      const newMetaDesc = document.createElement("meta");
      newMetaDesc.name = "description";
      newMetaDesc.content = description || siteSettings.seoDescription;
      document.head.appendChild(newMetaDesc);
    }
  }, [title, description]);
}
