# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog "Failed to compile" [ref=e4]:
    - generic [ref=e5]:
      - heading "Failed to compile" [level=4] [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e10]:
          - generic [ref=e11]: "./app/report/page.tsx Error:"
          - generic [ref=e12]: x
          - generic [ref=e13]: "Unexpected token `div`. Expected jsx identifier ,-["
          - generic [ref=e14]: /Users/hugowentzel/sunspire-clean/app/report/page.tsx
          - generic [ref=e15]: :589:1]
          - generic [ref=e16]: "589"
          - generic [ref=e17]: "| }"
          - generic [ref=e18]: "590"
          - generic [ref=e19]: "|"
          - generic [ref=e20]: "591"
          - generic [ref=e21]: "| return ("
          - generic [ref=e22]: "592"
          - generic [ref=e23]: "| <div :"
          - generic [ref=e24]: ^^^
          - generic [ref=e26]: "593"
          - generic [ref=e27]: "| className=\"min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter\""
          - generic [ref=e28]: "594"
          - generic [ref=e29]: "| data-demo={demoMode}"
          - generic [ref=e30]: "595"
          - generic [ref=e31]: "| > `---- Caused by: Syntax Error"
        - contentinfo [ref=e32]:
          - paragraph [ref=e33]:
            - generic [ref=e34]: This error occurred during the build process and can only be dismissed by fixing the error.
```